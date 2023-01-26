/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useState, useRef, useEffect } from "react";
import { InlineMath } from "react-katex";

import ListItem from "./ListItem";
import InputBox, { cursor } from "../InputBox";

import Render from "./Render";
import Utils from "../../utils/Utils";
import Emitter from "../../utils/Emitter";

const Graphing: React.FC = memo(() => {
    const [list, setList] = useState<string[]>([]);
    const inputRef = useRef<InputBox>(null);

    const handleAddFunction = async () => {
        if(!inputRef.current) return;
        const currentList = await Utils.getCurrentState(setList);
        var inputBox = inputRef.current;

        var value = inputBox.value;
        setList([...currentList, value]);
        Emitter.get().emit("add-function", value);

        inputBox.reset();
    };

    useEffect(() => {
        Utils.scrollToEnd("function-list", 1, 0);
    }, [list]);

    useEffect(() => {
        const canvas = Utils.getElem<HTMLCanvasElement>("graphing");
        const ctx = canvas.getContext("2d");
        if(!ctx) return;

        // Init size
        canvas.width = Utils.getElem("display-frame").clientWidth;
        canvas.height = Utils.getElem("display-frame").clientHeight;

        // Init ratio
        const ratio = Utils.getPixelRatio(ctx);
        canvas.width *= ratio;
        canvas.height *= ratio;

        // Init renderer
        var renderer = new Render(canvas, ctx);

        // Init timer
        function render() {
            renderer.render();
            window.requestAnimationFrame(render);
        }
        window.requestAnimationFrame(render);

        Emitter.get().on("add-function", (rawText: string) => {
            renderer.registerFunction(rawText);
        });
    }, []);

    useEffect(() => {
        document.body.addEventListener("keydown", (e: KeyboardEvent) => {
            if(e.key === "Enter" && inputRef.current?.value !== cursor) handleAddFunction();
        });
    }, []);

    return (
        <>
            <div className="function-input-container">
                <div className="function-input-box">
                    <div className="function-input-box-tag">
                        <span><InlineMath>y =</InlineMath></span>
                    </div>
                    <InputBox ref={inputRef} ltr={true}/>
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
