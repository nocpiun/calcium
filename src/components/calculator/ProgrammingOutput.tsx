/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { BlockMath } from "react-katex";

import { cursor } from "../../global";
import { NumberType } from "../../types";
import Emitter from "../../utils/Emitter";
import Utils from "../../utils/Utils";

import NumberBox from "./NumberBox";
import Cursor from "./Cursor";

const ProgrammingOutput: React.FC = () => {
    const [displayContent, setDisplayContent] = useState<string>(cursor);
    const contentRef = useRef<string>(displayContent);

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

                contentArray = Utils.arrayRemove(contentArray, cursorIndex);
                contentArray = Utils.arrayPut(contentArray, cursorIndex - 1, cursor);

                setDisplayContent(contentArray.join(" "));
                break;
            case "ArrowRight":
            case "\\rightarrow":
                if(cursorIndex === contentArray.length - 1) return;

                contentArray = Utils.arrayRemove(contentArray, cursorIndex);
                contentArray = Utils.arrayPut(contentArray, cursorIndex + 1, cursor);
                
                setDisplayContent(contentArray.join(" "));
                break;
            case "\\ll":
                /** @todo */
                break;
            case "\\gg":
                /** @todo */
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
        Emitter.get().on("input", (symbol: string) => handleInput(symbol));

        document.body.addEventListener("keydown", (e: KeyboardEvent) => {
            if(e.key === cursor) return;
            if(!Utils.isAllowedProgrammingSymbol(e.key)) return;

            handleInput(e.key);
        });
    }, []);

    return (
        <div className="output-container">
            <span className="output-tag">Output</span>

            <ul className="number-box-list">
                <NumberBox name="Hex" number={0} type={NumberType.HEX}/>
                <NumberBox name="Dec" number={0} type={NumberType.DEC}/>
                <NumberBox name="Oct" number={0} type={NumberType.OCT}/>
                <NumberBox name="Bin" number={0} type={NumberType.BIN}/>
            </ul>

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
        </div>
    );
}

export default ProgrammingOutput;
