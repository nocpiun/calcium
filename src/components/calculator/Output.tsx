/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { BlockMath } from "react-katex";

import { cursor } from "../../global";
import Emitter from "../../utils/Emitter";
import Utils from "../../utils/Utils";

import Cursor from "./Cursor";

const Output: React.FC = () => {
    const [displayContent, setDisplayContent] = useState<string>(cursor);
    const contentRef = useRef<string>(displayContent);

    function moveCursorTo(index: number): void {
        var contentArray = contentRef.current.split(" ");
        var cursorIndex = contentArray.indexOf(cursor);

        contentArray = Utils.arrayRemove(contentArray, cursorIndex);
        contentArray = Utils.arrayPut(contentArray, index, cursor);

        setDisplayContent(contentArray.join(" "));
    }

    const handleInput = (symbol: string) => {
        var contentArray = contentRef.current.split(" ");
        var cursorIndex = contentArray.indexOf(cursor);

        switch(symbol) {
            case "\\text{Clear}":
                setDisplayContent(cursor);
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
            case "=":
                /** @todo */
                break;
            default:
                setDisplayContent(contentRef.current.replace(cursor, symbol +" "+ cursor));
                break;
        }
    };

    /**
     * Click to move the cursor
     */
    const handleSymbolClick = (e: React.MouseEvent, index: number) => {
        if(index > contentRef.current.split(" ").indexOf(cursor)) index--;

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
        Emitter.get().on("input", (symbol: string) => handleInput(symbol));

        document.body.addEventListener("keydown", (e: KeyboardEvent) => {
            if(e.key === cursor) return;
            if(!Utils.isAllowedSymbol(e.key)) return;

            handleInput(e.key);
        });
    }, []);

    return (
        <div className="output-container">
            <span className="output-tag">Output</span>
            <div className="output-box">
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
        </div>
    );
}

export default Output;
