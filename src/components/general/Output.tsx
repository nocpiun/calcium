/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { BlockMath } from "react-katex";

import { cursor } from "../InputBox";
import Emitter from "../../utils/Emitter";
import Utils from "../../utils/Utils";
import Compiler from "../../utils/Compiler";

import Cursor from "../Cursor";

const specialSymbols: string[] = [
    "sin", "cos", "tan", "cot", "sec", "csc",
    "ln", "lg", "deg"
];

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
            case "i": // Pi
                if(contentArray[cursorIndex - 1] === "p") {
                    contentArray[cursorIndex - 1] = "\\pi";
                    setDisplayContent(contentArray.join(" "));
                } else {
                    setDisplayContent(contentRef.current.replace(cursor, symbol +" "+ cursor));
                    setOutputContent("");
                }
                break;
            case "Enter":
            case "\\text{Result}":
                if(contentArray.length > 1) handleResult();
                break;
            default:
                // Function auto complete
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

                            setDisplayContent(contentArray.join(" "));
                            return;
                        }
                    }
                }
                
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
        if(result.indexOf("NaN") > -1 || result === "") result = "\\text{Error}";

        // Display the result
        setOutputContent("="+ result);

        // Add the result to history list
        Emitter.get().emit("add-record", rawText, result);
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
        
        Utils.scrollToEnd("display");
    }, [displayContent]);
    useEffect(() => {
        outputRef.current = outputContent;
    }, [outputContent]);

    useEffect(() => {
        Emitter.get().on("input", (symbol: string) => handleInput(symbol));

        document.body.addEventListener("keydown", (e: KeyboardEvent) => {
            if(e.key === cursor) return;
            if(!Utils.isAllowedSymbol(e.key)) return;
            if(e.ctrlKey && e.key === "m") { // ctrl + m
                setOutputContent("c^{xk}+c^{trl}"); // I'm iKun
                return;
            }

            var inputValue = e.key;
            if(inputValue === "*") inputValue = "??";

            handleInput(inputValue);
        });
    }, []);

    return (
        <div className="output-container">
            <span className="output-tag">Output</span>
            <div className="input-box">
                <span className="display" id="display" onClick={(e) => handleBlankClick(e)}>
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
