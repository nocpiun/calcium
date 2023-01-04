/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { BlockMath } from "react-katex";

import Cursor from "./Cursor";
import Emitter from "../../utils/Emitter";
import Utils from "../../utils/Utils";

const cursor = "_";

const Output: React.FC = () => {
    const [displayContent, setDisplayContent] = useState<string>(cursor);
    const contentRef = useRef<string>(displayContent);

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
            case "=":
                /** @todo */
                break;
            default:
                setDisplayContent(contentRef.current.replace(cursor, symbol +" "+ cursor));
                break;
        }
    };

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
                <span className="display">
                    {
                        displayContent.split(" ").map((symbol, index) => {
                            return (
                                symbol === cursor
                                ? <Cursor key={index}/>
                                : <BlockMath key={index}>{symbol}</BlockMath>
                            )
                        })
                    }
                </span>
            </div>
        </div>
    );
}

export default Output;
