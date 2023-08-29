/* eslint-disable react-hooks/exhaustive-deps */
import React, {
    memo,
    useState,
    useEffect,
    useRef,
    useContext
} from "react";
import { useContextMenu, ContextMenuItem } from "use-context-menu";
import download from "downloadjs";

import MainContext from "../../contexts/MainContext";

import useEmitter from "../../hooks/useEmitter";

import Utils from "../../utils/Utils";
import Emitter from "../../utils/Emitter";
import Logger from "../../utils/Logger";
import { MouseDirection } from "../../types";

import GraphingWorker from "../../workers/graphing.worker.ts";

const Graphing: React.FC = memo(() => {
    const { setFunctionList } = useContext(MainContext);
    const [reloadTrigger, reloader] = useState(0);
    const workerRef = useRef<GraphingWorker | null>(null);

    useEffect(() => {
        // Create worker
        workerRef.current = new GraphingWorker();
        // if(!workerRef.current) return;

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
        workerRef.current.onmessage = (e: {data: any}) => {
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
            setFunctionList([]);

            reloader(reloadTrigger + 1);
        });

        // Listen to the change of theme, then change the colors inside canvas
        new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if(!workerRef.current) return;
                if(mutation.type === "attributes") {
                    workerRef.current.postMessage({ type: "theme-change", isDarkMode: !Utils.isDarkMode() });
                }
            });
        }).observe(document.body, { attributes: true });

        return () => { // Unregister renderer and worker
            if(!workerRef.current) return;
            workerRef.current.postMessage({ type: "reset" });
            workerRef.current.terminate();
        };
    }, [reloadTrigger]);

    useEffect(() => {
        Emitter.get().on("remove-function", async (id: number, index: number) => {
            if(!workerRef.current) return;
            workerRef.current.postMessage({ type: "remove-function", index });
            
            // Remove the function from the list
            const currentList = await Utils.getCurrentState(setFunctionList);
            for(let i = 0; i < currentList.length; i++) {
                if(currentList[i].id === id) {
                    // Clone the object of edited array by `Object.create`
                    // Otherwise, `setList` won't work.
                    setFunctionList(Object.create(Utils.arrayRemove(currentList, i)));
                    break;
                }
            }
        });
    }, []);

    useEmitter([
        ["add-function", (rawText: string) => {
            if(!workerRef.current) return;
            workerRef.current.postMessage({ type: "add-function", rawText });
        }],
        ["clear-function", () => {
            if(!workerRef.current) return;
            setFunctionList([]);
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

    const { contextMenu, onContextMenu } = useContextMenu(
        <>
            <ContextMenuItem onSelect={() => Emitter.get().emit("graphing-capture")}>捕捉图像</ContextMenuItem>
            <ContextMenuItem onSelect={() => Emitter.get().emit("graphing-reload")}>重载</ContextMenuItem>
        </>
    );

    return (
        <>
            <div
            className="graphing-container"
            id="display-frame"
            onContextMenu={onContextMenu}>
                <canvas className="graphing-canvas" id="graphing"/>
            </div>
            {contextMenu}
        </>
    );
})

export default Graphing;
