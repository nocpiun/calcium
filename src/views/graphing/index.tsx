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
import * as Tone from "tone";

import SidebarOpener from "@/components/SidebarOpener.tsx";

import MainContext from "@/contexts/MainContext";

import useEmitter from "@/hooks/useEmitter";

import Utils from "@/utils/Utils";
import Emitter from "@/utils/Emitter";
import Logger from "@/utils/Logger";
import { FunctionInputtingType, MovingDirection } from "@/types";

const Graphing: React.FC = memo(() => {
    const { setFunctionList, axis } = useContext(MainContext);
    const [reloadTrigger, reloader] = useState(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        // MARK: Initialization

        // Create worker
        workerRef.current = new Worker(new URL("@/workers/graphing.worker.ts", import.meta.url));

        // Get canvas object
        const canvas = Utils.getElem<HTMLCanvasElement>("graphing");
        const ctx = canvas.getContext("bitmaprenderer");
        if(!ctx) return;

        // Init size
        const width = Utils.getElem("display-frame").clientWidth;
        const height = Utils.getElem("display-frame").clientHeight;
        canvas.style.width = width +"px";
        canvas.style.height = height +"px";
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;

        // Init worker
        var offscreenCanvas = new OffscreenCanvas(canvas.width, canvas.height);
        workerRef.current.postMessage({
            type: "init",
            canvas: offscreenCanvas,
            ratio: window.devicePixelRatio,
            isDarkMode: Utils.isDarkMode(),
            isMobile: Utils.isMobile(),
            axis
        }, [offscreenCanvas]);
        workerRef.current.onmessage = (e: {data: any}) => {
            switch(e.data.type) {
                case "render":
                    if(isLoading) setIsLoading(false);
                    ctx.transferFromImageBitmap(e.data.imageBitmap);
                    break;
                case "fps":
                    new Emitter().emit("graphing-fps", e.data.fps);
                    break;
                case "play":
                    const rawPitches = e.data.rawPitches;
                    const synth = new Tone.Synth().toDestination();
                    const now = Tone.now();

                    for(let i = 0; i < rawPitches.length; i += 20) {
                        if(!isFinite(rawPitches[i])) continue;

                        const n = Utils.pitchToNoteStr(rawPitches[i]);
                        try {
                            synth.triggerAttackRelease(n, "8n", now + i * .001);
                        } catch (e) {
                            continue;
                        }
                    }
                    break;
            }
        };

        // MARK: Event Handlers

        // Init events
        canvas.addEventListener("mousedown", (e: MouseEvent) => {
            if(!workerRef.current) return;
            workerRef.current.postMessage({ type: "mouse-down", rect: canvas.getBoundingClientRect(), cx: e.clientX, cy: e.clientY });
        });
        window.addEventListener("mousemove", (e: MouseEvent) => {
            if(!workerRef.current) return;

            var direction: MovingDirection;
            if(e.movementX < 0) {
                direction = MovingDirection.LEFT;
            } else {
                direction = MovingDirection.RIGHT;
            }

            workerRef.current.postMessage({ type: "mouse-move", rect: canvas.getBoundingClientRect(), cx: e.clientX, cy: e.clientY, direction });
        });
        window.addEventListener("mouseup", () => {
            if(!workerRef.current) return;
            workerRef.current.postMessage({ type: "mouse-up" });
        });
        canvas.addEventListener("wheel", (e: WheelEvent) => {
            if(!workerRef.current) return;
            workerRef.current.postMessage({ type: "wheel", dy: e.deltaY });
        });

        // Init mobile events
        var lastTouch: Touch;
        canvas.addEventListener("touchstart", (e: TouchEvent) => {
            if(!workerRef.current) return;
            workerRef.current.postMessage({ type: "mouse-down", rect: canvas.getBoundingClientRect(), cx: e.touches[0].clientX, cy: e.touches[0].clientY });
        });
        canvas.addEventListener("touchmove", (e: TouchEvent) => {
            if(!workerRef.current) return;

            e.preventDefault();
            if(!lastTouch) lastTouch = e.changedTouches[0];

            var direction: MovingDirection;
            if(lastTouch.clientX > e.changedTouches[0].clientX) {
                direction = MovingDirection.LEFT;
            } else {
                direction = MovingDirection.RIGHT;
            }
            lastTouch = e.changedTouches[0];

            workerRef.current.postMessage({ type: "mouse-move", rect: canvas.getBoundingClientRect(), cx: e.changedTouches[0].clientX, cy: e.changedTouches[0].clientY, direction });
        });
        canvas.addEventListener("touchend", () => {
            if(!workerRef.current) return;
            workerRef.current.postMessage({ type: "mouse-up" });
        });
        canvas.addEventListener("touchcancel", () => {
            if(!workerRef.current) return;
            workerRef.current.postMessage({ type: "mouse-up" });
        });

        // "graphing-reload" cannot be moved into `useEmitter` hook
        new Emitter().on("graphing-reload", () => {
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
                    // Why did I add a `!` here before the `Utils.isDarkMode()`????
                    // workerRef.current.postMessage({ type: "theme-change", isDarkMode: !Utils.isDarkMode() });
                    workerRef.current.postMessage({ type: "theme-change", isDarkMode: Utils.isDarkMode() });
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
        if(!workerRef.current) return;
        workerRef.current.postMessage({ type: "axis-type-change", axis });
    }, [axis]);

    useEffect(() => {
        new Emitter().on("remove-function", async (id: number, index: number) => {
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

        new Emitter().on("play-function", (index: number) => {
            if(!workerRef.current) return;
            workerRef.current.postMessage({ type: "play-function", index });
        });
    }, []);

    useEmitter([
        ["add-function", (rawText: string, id: number, mode: FunctionInputtingType) => {
            if(!workerRef.current) return;
            workerRef.current.postMessage({ type: "add-function", rawText, id, mode });
        }],
        ["clear-function", () => {
            if(!workerRef.current) return;
            setFunctionList([]);
            workerRef.current.postMessage({ type: "clear-function" });
        }],
        ["set-function", async (index: number, value: string, id: number, mode: FunctionInputtingType) => {
            if(!workerRef.current) return;
            
            const currentList = await Utils.getCurrentState(setFunctionList);
            for(let i = 0; i < currentList.length; i++) {
                if(currentList[i].id === id) {
                    var newArr: typeof currentList = Object.create(currentList);
                    newArr[i].value = value;
                    setFunctionList(newArr);
                    break;
                }
            }
            workerRef.current.postMessage({ type: "set-function", index, rawText: value, mode });
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

    // MARK: Dom

    const { contextMenu, onContextMenu } = useContextMenu(
        <>
            <ContextMenuItem onSelect={() => new Emitter().emit("graphing-capture")}>捕捉图像</ContextMenuItem>
            <ContextMenuItem onSelect={() => new Emitter().emit("graphing-reload")}>重载</ContextMenuItem>
        </>
    );

    return (
        <>
            <div
            className="graphing-container"
            id="display-frame"
            onContextMenu={onContextMenu}>
                <SidebarOpener />

                <canvas className="graphing-canvas" id="graphing"/>
                <div className="loading-container" style={{ display: isLoading ? "flex" : "none" }}>
                    <div className="loading-text">
                        <p>Calcium</p>
                    </div>
                </div>
            </div>
            {contextMenu}

            {/* Mobile only */}
            {Utils.isMobile() && <div className="mobile-graphing-input-container" id="graphing-input"/>}
        </>
    );
})

export default Graphing;
