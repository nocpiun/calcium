/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { BlockMath } from "react-katex";

import { cursor } from "../../global";
import Emitter from "../../utils/Emitter";
import Utils from "../../utils/Utils";
import Compiler from "./Compiler";

import Cursor from "./Cursor";

const Output: React.FC = () => {
    const [displayContent, setDisplayContent] = useState<string>(cursor);
    const [outputContent, setOutputContent] = useState<string>("");
    const contentRef = useRef<string>(displayContent);
    const outputRef = useRef<string>(outputContent);
    const variableRef = useRef<Map<string, string>>(new Map<string, string>());

    function getCursorIndex(): number {
        return contentRef.current.split(" ").indexOf(cursor);
    }

    function moveCursorTo(index: number): void {
        var contentArray = contentRef.current.split(" ");
        var cursorIndex = getCursorIndex();

        contentArray = Utils.arrayRemove(contentArray, cursorIndex);
        contentArray = Utils.arrayPut(contentArray, index, cursor);

        setDisplayContent(contentArray.join(" "));
    }

    const handleInput = (symbol: string) => {
        var contentArray = contentRef.current.split(" ");
        var cursorIndex = getCursorIndex();

        switch(symbol) {
            case "\\text{Clear}":
                setDisplayContent(cursor);
                setOutputContent("");
                break;
            case "Backspace":
            case "\\text{Del}":
                var target = cursorIndex;
                if(contentArray[target] === cursor) {
                    target--;
                    if(target < 0) return;
                }

                contentArray = Utils.arrayRemove(contentArray, target);
                setDisplayContent(contentArray.join(" "));
                setOutputContent("");
                break;
            case "ArrowLeft":
            case "\\leftarrow":
                if(cursorIndex === 0) return;

                moveCursorTo(cursorIndex - 1);
                break;
            case "ArrowRight":
            case "\\rightarrow":
                if(cursorIndex === contentArray.length - 1) return;

                moveCursorTo(cursorIndex + 1);
                break;
            case "Enter":
            case "\\text{Result}":
                if(contentArray.length > 1) handleResult();
                break;
            default:
                setDisplayContent(contentRef.current.replace(cursor, symbol +" "+ cursor));
                setOutputContent("");
                break;
        }
    };

    const handleResult = () => {
        // Remove cursor from raw text
        var rawText = contentRef.current.indexOf(cursor) < contentRef.current.length - 1
        ? contentRef.current.replace(cursor +" ", "")
        : contentRef.current.replace(" "+ cursor, "");
        var raw = rawText.split(" ");

        if(rawText === "2 . 5") {
            setOutputContent("2.5c^{trl}"); // Chicken is beautiful
            return;
        }

        if(Compiler.isVariable(raw[0]) && raw[1] === "=") { // variable declaring or setting
            const varName = raw[0];

            raw = Utils.arrayRemove(raw, 0);
            raw = Utils.arrayRemove(raw, 0);

            variableRef.current.set(varName, new Compiler(raw, variableRef.current).run());
            setOutputContent(varName +"="+ variableRef.current.get(varName));
            return;
        }

        var compiler = new Compiler(raw, variableRef.current);

        var result = compiler.run();
        if(result === "NaN" || result === "") result = "\\text{Error}";

        setOutputContent("="+ result);
    };

    /**
     * Click to move the cursor
     */
    const handleSymbolClick = (e: React.MouseEvent, index: number) => {
        if(index > getCursorIndex()) index--;

        var symbolElem = e.target as HTMLElement;
        var mouseX = e.clientX;
        var symbolCenterX = Utils.getOffsetLeft(symbolElem) + (symbolElem.offsetWidth / 2);
        if(mouseX > symbolCenterX) index++;

        moveCursorTo(index);
    };
    const handleBlankClick = (e: React.MouseEvent) => {
        // only the blank area of display box is available
        if((e.target as HTMLElement).className !== "display") return;

        moveCursorTo(0);
    };
    /*****/

    useEffect(() => {
        contentRef.current = displayContent;
    }, [displayContent]);
    useEffect(() => {
        outputRef.current = outputContent;
    }, [outputContent]);

    useEffect(() => {
        Emitter.get().on("input", (symbol: string) => handleInput(symbol));

        document.body.addEventListener("keydown", (e: KeyboardEvent) => {
            e.preventDefault();

            if(e.key === cursor) return;
            if(!Utils.isAllowedSymbol(e.key)) return;
            if(e.ctrlKey && e.key === "m") { // ctrl + m
                setOutputContent("c^{xk}+c^{trl}"); // I'm iKun
                return;
            }

            var inputValue = e.key;
            if(inputValue === "*") inputValue = "×";

            handleInput(inputValue);
        });
    }, []);

    return (
        <div className="output-container">
            <span className="output-tag">Output</span>
            <div className="input-box">
                <span className="display" onClick={(e) => handleBlankClick(e)}>
                    {
                        displayContent.split(" ").map((symbol, index) => {
                            return (
                                symbol === cursor
                                ? <Cursor key={index}/>
                                : (
                                    <span
                                        onClick={(e) => handleSymbolClick(e, index)}
                                        data-index={index}
                                        key={index}>
                                        <BlockMath>{symbol}</BlockMath>
                                    </span>
                                )
                            )
                        })
                    }
                </span>
            </div>
            <div className="output-box">
                <span className="display">
                    {outputContent.split(" ").map((symbol, index) => <BlockMath key={index}>{symbol}</BlockMath>)}
                </span>
            </div>
        </div>
    );
}

export default Output;
