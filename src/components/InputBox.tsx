/* eslint-disable react-hooks/rules-of-hooks */
import React, { Component, ReactElement } from "react";
import { BlockMath } from "react-katex";

import Cursor from "./Cursor";

import Utils from "../utils/Utils";
import Emitter from "../utils/Emitter";

interface InputBoxProps {
    ltr: boolean
}

interface InputBoxState {
    displayContent: string
}

const specialSymbols: string[] = [
    "sin", "cos", "tan", "cot", "sec", "csc",
    "ln", "lg", "deg"
];

export const cursor = "$";

export default class InputBox extends Component<InputBoxProps, InputBoxState> {
    public constructor(props: InputBoxProps) {
        super(props);

        this.state = {
            displayContent: cursor
        };
    }

    public get value(): string {
        return this.state.displayContent.indexOf(cursor) < this.state.displayContent.length - 1
        ? this.state.displayContent.replace(cursor +" ", "")
        : this.state.displayContent.replace(" "+ cursor, "");
    }

    public set value(newValue: string) {
        this.setState({ displayContent: newValue });
    }

    public reset(): void {
        this.value = cursor;
    }

    public getCursorIndex(): number {
        return this.state.displayContent.split(" ").indexOf(cursor);
    }

    public moveCursorTo(index: number): void {
        var contentArray = this.state.displayContent.split(" ");
        var cursorIndex = this.getCursorIndex();

        contentArray = Utils.arrayRemove(contentArray, cursorIndex);
        contentArray = Utils.arrayPut(contentArray, index, cursor);

        this.value = contentArray.join(" ");
    }

    private handleInput(symbol: string): void {
        var contentArray = this.state.displayContent.split(" ");
        var cursorIndex = this.getCursorIndex();

        switch(symbol) {
            case "\\text{Clear}":
                this.reset();
                // setOutputContent("");
                break;
            case "Backspace":
            case "\\text{Del}":
                var target = cursorIndex;
                if(contentArray[target] === cursor) {
                    target--;
                    if(target < 0) return;
                }

                contentArray = Utils.arrayRemove(contentArray, target);
                this.value = contentArray.join(" ");
                // setOutputContent("");
                break;
            case "ArrowLeft":
            case "\\leftarrow":
                if(cursorIndex === 0) return;

                this.moveCursorTo(cursorIndex - 1);
                break;
            case "ArrowRight":
            case "\\rightarrow":
                if(cursorIndex === contentArray.length - 1) return;

                this.moveCursorTo(cursorIndex + 1);
                break;
            case "i": // Pi
                if(contentArray[cursorIndex - 1] === "p") {
                    contentArray[cursorIndex - 1] = "\\pi";
                    this.value = contentArray.join(" ");
                } else {
                    this.value = this.state.displayContent.replace(cursor, symbol +" "+ cursor);
                    // setOutputContent("");
                }
                break;
            case "Enter":
            case "\\text{Result}":
                // if(contentArray.length > 1) handleResult();
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

                            this.value = contentArray.join(" ");
                            return;
                        }
                    }
                }
                
                this.value = this.state.displayContent.replace(cursor, symbol +" "+ cursor);
                // setOutputContent("");
                break;
        }
    }

    private handleSymbolClick(e: React.MouseEvent, index: number): void {
        if(index > this.getCursorIndex()) index--;

        var symbolElem = e.target as HTMLElement;
        var mouseX = e.clientX;
        var symbolCenterX = Utils.getOffsetLeft(symbolElem) + (symbolElem.offsetWidth / 2);
        if(mouseX > symbolCenterX) index++;

        this.moveCursorTo(index);
    }

    private handleBlankClick(e: React.MouseEvent) {
        // only the blank area of display box is available
        if((e.target as HTMLElement).className !== "display") return;

        this.moveCursorTo(this.props.ltr ? this.state.displayContent.split(" ").length - 1 : 0);
    }

    public render(): ReactElement {
        return (
            <div className="input-box">
                <span className="display" id="display" onClick={(e) => this.handleBlankClick(e)}>
                    {
                        this.state.displayContent.split(" ").map((symbol, index) => {
                            return (
                                symbol === cursor
                                ? <Cursor key={index}/>
                                : (
                                    <span
                                        onClick={(e) => this.handleSymbolClick(e, index)}
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
        );
    }

    public componentDidMount(): void {
        Emitter.get().on("input", (symbol: string) => this.handleInput(symbol));

        document.body.addEventListener("keydown", (e: KeyboardEvent) => {
            if(e.key === cursor) return;
            if(!Utils.isAllowedSymbol(e.key)) return;
            // if(e.ctrlKey && e.key === "m") { // ctrl + m
            //     setOutputContent("c^{xk}+c^{trl}"); // I'm iKun
            //     return;
            // }

            var inputValue = e.key;
            if(inputValue === "*") inputValue = "×";

            this.handleInput(inputValue);
        });
    }
}
