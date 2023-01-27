/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useState, useRef, useEffect } from "react";
import { InlineMath } from "react-katex";

import ListItem from "./ListItem";
import InputBox, { specialSymbols, cursor } from "../InputBox";

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
