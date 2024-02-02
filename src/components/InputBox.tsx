/* eslint-disable react-hooks/rules-of-hooks */
import React, { Component, ReactElement, DOMAttributes } from "react";
import { BlockMath } from "react-katex";

import Cursor from "@/components/Cursor";

import { InputTag } from "@/types";
import Utils from "@/utils/Utils";
import Emitter from "@/utils/Emitter";
import Is from "@/compiler/Is";

interface InputBoxProps {
    ltr: boolean
    highlight?: boolean
    isProgrammingMode?: boolean
    shouldAvoidDialog?: boolean
    onInputSymbol?: (symbol: string) => string | void
}

interface InputBoxState {
    onInputSymbol?: (symbol: string) => string | void
}

export const cursor = "$";

type _Props = InputBoxProps & DOMAttributes<HTMLDivElement>;

export default class InputBox extends Component<_Props, InputBoxState> {
    private shouldAvoidDialog: boolean = true;
    public ctx: InputContext;

    public constructor(props: _Props) {
        super(props);

        this.state = {
            onInputSymbol: props.onInputSymbol
        };

        this.ctx = new InputContext(props.highlight);

        if(this.props.shouldAvoidDialog !== undefined && this.props.shouldAvoidDialog === false) {
            this.shouldAvoidDialog = false;
        }
    }

    public get value(): string {
        return this.ctx.getCombinedWithoutCursor();
    }

    public reset(): void {
        this.ctx.reset();
    }

    public input(symbol: string): void {
        this.handleInput(symbol);
    }

    public handleInput(symbol: string): void {
        var symbolList = this.ctx.symbolList;
        var cursorIndex = this.ctx.getCursorIndex();

        switch(symbol) {
            case "ArrowLeft":
            case "\\leftarrow":
                if(cursorIndex === 0) return;

                this.ctx.moveCursorTo(cursorIndex - 1);
                break;
            case "ArrowRight":
            case "\\rightarrow":
                if(cursorIndex === this.ctx.length - 1) return;

                this.ctx.moveCursorTo(cursorIndex + 1);
                break;
            case "^":
                if(symbolList[cursorIndex - 1].value.indexOf("^") > -1) {
                    const currentExponentialStr = symbolList[cursorIndex - 1].value.replace("^", "");
                    const newExponential = parseInt(currentExponentialStr) + 1;
                    if(newExponential > 9) return;

                    symbolList[cursorIndex - 1].value = "^"+ newExponential;
                    this.forceUpdate();
                    return;
                }

                this.ctx.input(new InputSymbol("^2"));
                break;
            default:
                if(this.state.onInputSymbol) this.state.onInputSymbol(symbol);
        }
    }

    private handleSymbolClick(e: React.MouseEvent, index: number): void {
        if(index > this.ctx.getCursorIndex()) index--;

        var symbolElem = e.target as HTMLElement;
        var mouseX = e.clientX;
        var symbolCenterX = Utils.getOffsetLeft(symbolElem) + (symbolElem.offsetWidth / 2);
        if(mouseX > symbolCenterX) index++;

        this.ctx.moveCursorTo(index);
    }

    private handleBlankClick(e: React.MouseEvent) {
        // only the blank area of display box is available
        if((e.target as HTMLElement).className !== "display") return;

        this.ctx.moveCursorTo(this.props.ltr ? this.ctx.length - 1 : 0);
    }

    public render(): ReactElement {
        const { ltr, highlight, isProgrammingMode, onInputSymbol, ...attrProps } = this.props;

        return (
            <div className="input-box" {...attrProps}>
                <span className="display" id="display" onClick={(e) => this.handleBlankClick(e)}>
                    {
                        this.ctx.symbolList.map((symbol, index) => {
                            return (
                                symbol.value === cursor
                                ? <Cursor key={index}/>
                                : (
                                    <span
                                        className={highlight ? "tag-"+ symbol.tag : undefined}
                                        onClick={(e) => this.handleSymbolClick(e, index)}
                                        data-index={index}
                                        key={index}>
                                        <BlockMath>{symbol.value}</BlockMath>
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
        Emitter.get().on("symbol-list-update", () => this.forceUpdate());
        Emitter.get().on("input", (symbol: string) => this.handleInput(symbol));
        Emitter.get().on("clear-input", () => this.reset());
        Emitter.get().on("move-front", () => this.ctx.moveCursorTo(0));
        Emitter.get().on("move-back", () => this.ctx.moveCursorTo(this.ctx.length - 1));

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

            // input
            var oldValue = this.ctx.getCombined();
            this.handleInput(inputValue);

            /**
             * Only when the purified new value is equal to the purified
             * old value, don't do auto scroll
             */
            if(InputContext.removeCursor(oldValue) === this.ctx.getCombinedWithoutCursor()) return;
            Utils.scrollToEnd("display");
        });
    }

    public componentDidUpdate(prevProps: Readonly<InputBoxProps>): void {
        if(prevProps.onInputSymbol !== this.props.onInputSymbol) {
            this.setState({
                onInputSymbol: this.props.onInputSymbol
            });
        }
    }
}

export class InputSymbol {
    public value: string;
    public tag: InputTag;

    public static cursor = new InputSymbol(cursor);

    public constructor(value: string, tag: InputTag = InputTag.COMMON) {
        this.value = value;
        this.tag = tag;
    }
}

export class InputContext {
    private _symbolList: InputSymbol[] = [];
    private highlight: boolean;

    public get symbolList(): typeof this._symbolList {
        return this._symbolList;
    }

    public set symbolList(newValue: typeof this._symbolList) {
        this._symbolList = newValue;
        /**
         * Manually emit the event that makes `InputBox` component being updated forcedly,
         * so that the value in the input box will be consistent with `symbolList`.
         */
        Emitter.get().emit("symbol-list-update");
    }

    public get length(): number {
        return this._symbolList.length;
    }

    public constructor(highlight: boolean = false) {
        this.highlight = highlight;

        this.reset();
    }

    public reset(): void {
        this.symbolList = [InputSymbol.cursor];
    }

    public set(index: number, symbol: InputSymbol): InputSymbol {
        var old = this.symbolList[index];
        this.symbolList[index] = this.highlightSymbol(symbol);
        /**
         * To trigger the setter of `symbolList` to emit that event
         */
        // eslint-disable-next-line no-self-assign
        this.symbolList = this.symbolList;
        return old;
    }

    public getCursorIndex(): number {
        for(let i = 0; i < this.symbolList.length; i++) {
            if(this.symbolList[i].value === cursor) {
                return i;
            }
        }
        return -1;
    }

    public moveCursorTo(index: number): void {
        this.symbolList = Utils.arrayRemove(this.symbolList, this.getCursorIndex());
        this.symbolList = Utils.arrayPut(this.symbolList, index, InputSymbol.cursor);
    }

    public getCombined(): string {
        var combined = "";
        for(let i = 0; i < this.symbolList.length; i++) {
            combined += this.symbolList[i].value;
            if(i < this.symbolList.length - 1) {
                combined += " ";
            }
        }
        return combined;
    }

    public getCombinedWithoutCursor(): string {
        return InputContext.removeCursor(this.getCombined());
    }

    public static removeCursor(content: string): string {
        return content.indexOf(cursor) < content.length - 1
        ? content.replace(cursor +" ", "")
        : content.replace(" "+ cursor, "");
    }

    public setContent(newValue: string): void {
        var contentArray = newValue.split(" ");
        var newSymbolList = [];

        for(let i = 0; i < contentArray.length; i++) {
            newSymbolList.push(this.highlightSymbol(new InputSymbol(contentArray[i])));
        }

        this.symbolList = newSymbolList;
    }

    public input(symbol: InputSymbol, target: number = this.getCursorIndex()): void {
        this.symbolList = Utils.arrayPut(this.symbolList, target, this.highlightSymbol(symbol));
    }

    public backspace(): void {
        var target = this.getCursorIndex() - 1;
        if(target < 0) return;

        this.symbolList = Utils.arrayRemove(this.symbolList, target);
    }

    public highlightSymbol(symbol: InputSymbol): InputSymbol {
        if(!this.highlight || symbol.tag !== InputTag.COMMON) return symbol;

        if(Is.variable(symbol.value)) {
            symbol.tag = InputTag.VAR;
        } else if(Is.constant(symbol.value)) {
            symbol.tag = InputTag.CONST;
        } else if(Is.mathFunction(symbol.value)) {
            symbol.tag = InputTag.FUNC;
        }

        return symbol;
    }
}
