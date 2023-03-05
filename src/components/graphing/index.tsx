/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useState, useRef, useEffect } from "react";
import { InlineMath } from "react-katex";

import ListItem from "./ListItem";
import InputBox, { specialSymbols, cursor } from "../InputBox";

import Utils from "../../utils/Utils";
import Emitter from "../../utils/Emitter";
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
                            var begin = cursorIndex - splited.length + 1;
                            contentArray[begin] = "\\"+ specialSymbol +"(";
                            for(let j = 0; j < splited.length - 2; j++) {
                                contentArray = Utils.arrayRemove(contentArray, begin + 1);
                            }

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

        Emitter.get().on("add-function", (rawText: string) => {
            if(!workerRef.current) return;
            workerRef.current.postMessage({ type: "add-function", rawText });
        });
        
        Emitter.get().on("clear-function", () => {
            if(!workerRef.current) return;
            setList([]);
            workerRef.current.postMessage({ type: "clear-function" });
        });

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
                            <span>Add</span>
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
