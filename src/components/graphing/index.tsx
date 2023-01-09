/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { InlineMath } from "react-katex";

import ListItem from "./ListItem";

import Render from "./Render";
import Utils from "../../utils/Utils";

const Graphing: React.FC = () => {
    const [list, setList] = useState<string[]>([]);
    const listRef = useRef<string[]>(list);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleAddFunction = () => {
        if(!inputRef.current) return;
        var inputElem = inputRef.current;

        var value = inputElem.value;
        setList([...listRef.current, value]);

        inputElem.value = "";
    };

    useEffect(() => {
        Utils.scrollToEnd("function-list", 1, 0);
        
        listRef.current = list;
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
    }, []);

    useEffect(() => {
        document.body.addEventListener("keydown", (e: KeyboardEvent) => {
            if(e.key === "Enter") handleAddFunction();
        });
    }, []);

    return (
        <>
            <div className="function-input-container">
                <div className="function-input-box">
                    <div className="function-input-box-tag">
                        <span><InlineMath>y =</InlineMath></span>
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        className="function-input"/>
                    <div className="add-button-container">
                        <button className="add-button" onClick={() => handleAddFunction()}>
                            <span>+</span>
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
}

export default Graphing;
