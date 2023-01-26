/* eslint-disable react-hooks/rules-of-hooks */
import React, { Component, ReactElement } from "react";
import { BlockMath } from "react-katex";

import Cursor from "./Cursor";

import Utils from "../utils/Utils";
import Emitter from "../utils/Emitter";

interface InputBoxProps {
    ltr: boolean
    onInput?: (symbol: string) => string | void
}

interface InputBoxState {
    displayContent: string
}

export const specialSymbols: string[] = [
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

    public moveCursorTo(index: number): string {
        var contentArray = this.state.displayContent.split(" ");
        var cursorIndex = this.getCursorIndex();

        contentArray = Utils.arrayRemove(contentArray, cursorIndex);
        contentArray = Utils.arrayPut(contentArray, index, cursor);

        var result = contentArray.join(" ");
        this.value = result;
        return result;
    }

    private handleInput(symbol: string): void {
        if(this.props.onInput) this.value = this.props.onInput(symbol) ?? this.state.displayContent;
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
            if(e.key === "Enter") e.preventDefault();
            
            var inputValue = e.key;
            if(inputValue === "*") inputValue = "×";

            this.handleInput(inputValue);
        });
    }
}
