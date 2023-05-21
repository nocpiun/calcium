/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useState, useRef, useEffect } from "react";
import { InlineMath } from "react-katex";
import download from "downloadjs";

import ListItem from "./ListItem";
import InputBox, { specialSymbols, cursor } from "../InputBox";

import useEmitter from "../../hooks/useEmitter";

import Utils from "../../utils/Utils";
import Emitter from "../../utils/Emitter";
import Logger from "../../utils/Logger";
import { MouseDirection } from "../../types";

import GraphingWorker from "../../workers/graphing.worker.ts";

const Graphing: React.FC = memo(() => {
    const [list, setList] = useState<string[]>([]);
    const [reloadTrigger, reloader] = useState(0);
    const inputRef = useRef<InputBox>(null);
    const workerRef = useRef<GraphingWorker | null>(null);

    const handleAddFunction = async () => {
        if(!inputRef.current) return;
        const currentList = await Utils.getCurrentState(setList);
        var inputBox = inputRef.current;

        var value = inputBox.value;
        if(value === cursor) return;
        setList([...currentList, value]);
        Emitter.get().emit("add-function", value);
        Logger.info("Function rendered: "+ value.replaceAll(" ", ""));

        inputBox.reset();
    };

    const handleInput = (symbol: string) => {
        if(!inputRef.current) return;
        const inputBox = inputRef.current;
        const currentContent = inputBox.state.displayContent;

        var contentArray = currentContent.split(" ");
        var cursorIndex = inputBox.getCursorIndex();

        switch(symbol) {
            case "Backspace":
                var target = cursorIndex;
                if(contentArray[target] === cursor) {
                    target--;
                    if(target < 0) return;
                }

                contentArray = Utils.arrayRemove(contentArray, target);

                return contentArray.join(" ");
            case "ArrowLeft":
                if(cursorIndex === 0) return;

                return inputBox.moveCursorTo(cursorIndex - 1);
            case "ArrowRight":
                if(cursorIndex === contentArray.length - 1) return;

                return inputBox.moveCursorTo(cursorIndex + 1);
            case "Enter":
                if(contentArray.length > 1) handleAddFunction();
                return;
            case "i": // Pi
                if(contentArray[cursorIndex - 1] === "p") {
                    contentArray[cursorIndex - 1] = "\\pi";
                    return contentArray.join(" ");
                } else {

                    return currentContent.replace(cursor, symbol +" "+ cursor);
                }
            default:
                /**
                 * Function auto complete
                 * 
                 * For example,
                 * input 'lg', then it will auto complete it as '\lg('
                 * which can be correctly displayed by KaTeX
                 */
                for(let i = 0; i < specialSymbols.length; i++) {
                    var specialSymbol = specialSymbols[i];
                    if(symbol === specialSymbol[specialSymbol.length - 1]) {
                        var splited = specialSymbol.split("");
                        var passed = true;
                        for(let j = splited.length - 2; j >= 0; j--) {
                            if(contentArray[cursorIndex - (splited.length - j) + 1] !== splited[j]) {
                                passed = false;
                            }
                        }
                        if(passed) {
                            if(specialSymbol === "sqrt") {
                                specialSymbol = "√(";
                            } else if(specialSymbol === "cbrt") {
                                specialSymbol = "^3√(";
                            } else {
                                specialSymbol = "\\"+ specialSymbol +"(";
                            }

                            var begin = cursorIndex - splited.length + 1;
                            contentArray[begin] = specialSymbol;
                            for(let j = 0; j < splited.length - 2; j++) {
                                contentArray = Utils.arrayRemove(contentArray, begin + 1);
                            }
                            contentArray.push(")"); // Add right bracket automatically

                            return contentArray.join(" ");
                        }
                    }
                }
                
                return currentContent.replace(cursor, symbol +" "+ cursor);
        }
    };

    useEffect(() => {
        Utils.scrollToEnd("function-list", 1, 0);
    }, [list]);

    useEffect(() => {
        // Create worker
        workerRef.current = new GraphingWorker();
        if(!workerRef.current) return;

        // Get canvas object
        const canvas = Utils.getElem<HTMLCanvasElement>("graphing");
        const ctx = canvas.getContext("bitmaprenderer");
        if(!ctx) return;

        // Init size
        canvas.width = Utils.getElem("display-frame").clientWidth;
        canvas.height = Utils.getElem("display-frame").clientHeight;

        // Init worker
        var offscreenCanvas = new OffscreenCanvas(canvas.width, canvas.height);
        workerRef.current.postMessage({ type: "init", canvas: offscreenCanvas, isDarkMode: Utils.isDarkMode() }, [offscreenCanvas]);
        workerRef.current.onmessage = (e) => {
            switch(e.data.type) {
                case "render":
                    ctx.transferFromImageBitmap(e.data.imageBitmap);
                    break;
                case "fps":
                    Emitter.get().emit("graphing-fps", e.data.fps);
                    break;
            }
        };

        // Init events
        canvas.addEventListener("mousedown", (e: MouseEvent) => {
            if(!workerRef.current) return;
            workerRef.current.postMessage({ type: "mouse-down", rect: canvas.getBoundingClientRect(), cx: e.clientX, cy: e.clientY });
        });
        canvas.addEventListener("mousemove", (e: MouseEvent) => {
            if(!workerRef.current) return;

            var direction;
            if(e.movementX < 0) {
                direction = MouseDirection.LEFT;
            } else {
                direction = MouseDirection.RIGHT;
            }

            workerRef.current.postMessage({ type: "mouse-move", rect: canvas.getBoundingClientRect(), cx: e.clientX, cy: e.clientY, direction });
        });
        canvas.addEventListener("mouseup", () => {
            if(!workerRef.current) return;
            workerRef.current.postMessage({ type: "mouse-up" });
        });
        canvas.addEventListener("mouseleave", () => {
            if(!workerRef.current) return;
            workerRef.current.postMessage({ type: "mouse-leave" });
        });
        canvas.addEventListener("wheel", (e: WheelEvent) => {
            if(!workerRef.current) return;
            workerRef.current.postMessage({ type: "wheel", dy: e.deltaY });
        });

        // "graphing-reload" cannot be moved into `useEmitter` hook
        Emitter.get().on("graphing-reload", () => {
            if(!workerRef.current) return;
            workerRef.current.postMessage({ type: "reset" });
            workerRef.current.terminate();
            setList([]);

            reloader(reloadTrigger + 1);
        });

        return () => { // Unregister renderer and worker
            if(!workerRef.current) return;
            workerRef.current.postMessage({ type: "reset" });
            workerRef.current.terminate();
        };
    }, [reloadTrigger]);

    useEmitter([
        ["add-function", (rawText: string) => {
            if(!workerRef.current) return;
            workerRef.current.postMessage({ type: "add-function", rawText });
        }],
        ["clear-function", () => {
            if(!workerRef.current) return;
            setList([]);
            workerRef.current.postMessage({ type: "clear-function" });
        }],
        ["graphing-capture", () => {
            const canvas = Utils.getElem<HTMLCanvasElement>("graphing");
            const dataUrl = canvas.toDataURL();
            var tempCanvas = document.createElement("canvas");
            var tempCtx = tempCanvas.getContext("2d");
            var image = new Image();
            if(!tempCtx) return;

            image.src = dataUrl;
            image.onload = () => {
                if(!tempCtx) return;

                tempCanvas.width = image.width;
                tempCanvas.height = image.height;
                tempCtx.drawImage(image, 0, 0, image.width, image.height);
                var imageData = tempCtx.getImageData(0, 0, image.width, image.height).data;

                for(let i = 0; i < imageData.length; i += 4) {
                    var r = imageData[i],
                        g = imageData[i + 1],
                        b = imageData[i + 2];

                    if(
                        (
                            !(
                                (r === g && g === b && b === 30) ||
                                (r === g && g === b && b === 31) ||
                                (r === g && g === b && b === 32) ||
                                (r === g && g === b && b === 33) ||
                                (r === g && g === b && b === 34) ||
                                (r === g && g === b && b === 35) ||
                                (r === g && g === b && b === 36)
                            ) && !Utils.isDarkMode()
                        ) ||
                        (
                            !(
                                (r === g && g === b && b === 252) ||
                                (r === g && g === b && b === 253) ||
                                (r === g && g === b && b === 254) ||
                                (r === g && g === b && b === 255)
                            ) && Utils.isDarkMode()
                        )
                    ) {
                        imageData[i] = imageData[i + 1] = imageData[i + 2] = imageData[i + 3] = 255;
                    }
                }

                var matrix = tempCtx.createImageData(image.width, image.height);
                matrix.data.set(imageData);
                tempCtx.putImageData(matrix, 0, 0);

                tempCanvas.toBlob((blob) => {
                    if(!blob) return;
                    const url = URL.createObjectURL(blob);
                    window.open(url, "_blank");
                    download(url);
                    Logger.info("Image Captured: "+ url);
                });
            };
        }]
    ]);

    return (
        <>
            <div className="function-input-container">
                <div className="function-input-box">
                    <div className="function-input-box-tag">
                        <span><InlineMath>y =</InlineMath></span>
                    </div>
                    <InputBox
                        ref={inputRef}
                        ltr={true}
                        onInput={(symbol) => handleInput(symbol)}/>
                    <div className="add-button-container">
                        <button className="add-button" onClick={() => handleAddFunction()}>
                            <span>添加</span>
                        </button>
                    </div>
                </div>
                <div className="function-list" id="function-list">
                    {
                        list.map((value, index) => <ListItem value={value} index={index} key={index}/>)
                    }
                </div>
            </div>
            
            <div className="graphing-container" id="display-frame">
                <canvas className="graphing-canvas" id="graphing"/>
            </div>
        </>
    );
})

export default Graphing;
