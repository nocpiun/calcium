/* eslint-disable react-hooks/rules-of-hooks */
import React, { Component, ReactElement, DOMAttributes } from "react";
import { BlockMath } from "react-katex";

import Cursor from "@/components/Cursor";

import Utils from "@/utils/Utils";
import Emitter from "@/utils/Emitter";

interface InputBoxProps {
    ltr: boolean
    isProgrammingMode?: boolean
    shouldAvoidDialog?: boolean
    onInputSymbol?: (symbol: string) => string | void
}

interface InputBoxState {
    displayContent: string
    onInputSymbol?: (symbol: string) => string | void
}

export const cursor = "$";

type _Props = InputBoxProps & DOMAttributes<HTMLDivElement>;

export default class InputBox extends Component<_Props, InputBoxState> {
    private shouldAvoidDialog: boolean = true;

    public constructor(props: _Props) {
        super(props);

        this.state = {
            displayContent: cursor,
            onInputSymbol: props.onInputSymbol
        };

        if(this.props.shouldAvoidDialog !== undefined && this.props.shouldAvoidDialog === false) {
            this.shouldAvoidDialog = false;
        }
    }

    public get value(): string {
        return InputBox.removeCursor(this.state.displayContent);
    }

    /**
     * Set value of the input box and then scroll to the end
     * 
     * Only when the purified new value is equal to the purified
     * old value, don't do auto scroll
     */
    public set value(newValue: string) {
        const oldValue = this.state.displayContent;

        this.setState({ displayContent: newValue }, () => {
            if(InputBox.removeCursor(oldValue) === InputBox.removeCursor(newValue)) return;

            Utils.scrollToEnd("display");
        });
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

    public input(symbol: string): void {
        this.handleInput(symbol);
    }

    public handleInput(symbol: string): void {
        this.value = this.preHandleInput(symbol) ?? this.state.displayContent;
    }

    public preHandleInput(symbol: string): string | void {
        const currentContent = this.state.displayContent;

        var contentArray = currentContent.split(" ");
        var cursorIndex = this.getCursorIndex();

        switch(symbol) {
            case "ArrowLeft":
            case "\\leftarrow":
                if(cursorIndex === 0) return;

                return this.moveCursorTo(cursorIndex - 1);
            case "ArrowRight":
            case "\\rightarrow":
                if(cursorIndex === contentArray.length - 1) return;

                return this.moveCursorTo(cursorIndex + 1);
            case "^":
                if(contentArray[cursorIndex - 1].indexOf("^") > -1) {
                    const currentExponentialStr = contentArray[cursorIndex - 1].replace("^", "");
                    const newExponential = parseInt(currentExponentialStr) + 1;
                    if(newExponential > 9) return;

                    contentArray[cursorIndex - 1] = "^"+ newExponential;
                    return contentArray.join(" ");
                }

                return currentContent.replace(cursor, "^2 "+ cursor);
            default:
                if(this.state.onInputSymbol) return this.state.onInputSymbol(symbol);
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
        const { ltr, isProgrammingMode, onInputSymbol, ...attrProps } = this.props;

        return (
            <div className="input-box" {...attrProps}>
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
        Emitter.get().on("clear-input", () => this.reset());
        Emitter.get().on("move-front", () => this.value = cursor +" "+ this.value);
        Emitter.get().on("move-back", () => this.value = this.value +" "+ cursor);

        document.body.addEventListener("keydown", (e: KeyboardEvent) => {
            if(e.key === cursor) return;
            if(e.ctrlKey) return;
            if(!this.props.isProgrammingMode && !Utils.isAllowedSymbol(e.key)) return;
            if(this.props.isProgrammingMode && !Utils.isAllowedProgrammingSymbol(e.key)) return;
            if(e.key === "Enter") {
                e.preventDefault();
                document.body.focus();
            }
            if(e.key === " ") {
                e.preventDefault();
                return;
            }
            if(Utils.isAnyDialogOpen() && this.shouldAvoidDialog) return;
            
            var inputValue = e.key;
            if(inputValue === "*") inputValue = "×";

            this.handleInput(inputValue);
        });
    }

    public componentDidUpdate(prevProps: Readonly<InputBoxProps>): void {
        if(prevProps.onInputSymbol !== this.props.onInputSymbol) {
            this.setState({
                onInputSymbol: this.props.onInputSymbol
            });
        }
    }

    public static removeCursor(content: string): string {
        return content.indexOf(cursor) < content.length - 1
        ? content.replace(cursor +" ", "")
        : content.replace(" "+ cursor, "");
    }
}
