import React, { useState, useRef, useEffect, useCallback } from "react";
import { BlockMath } from "react-katex";
import { useContextMenu, ContextMenuItem } from "use-context-menu";

import { HistoryItemInfo } from "../../components/sidebar/History";

import { errorText } from "../../global";
import { NumberSys } from "../../types";
import Emitter from "../../utils/Emitter";
import Utils from "../../utils/Utils";
import Compiler from "../../compiler/Compiler";
import Is from "../../compiler/Is";
import Transformer from "../../compiler/Transformer";
import Logger from "../../utils/Logger";
import { RecordType } from "../../types";

import useEmitter from "../../hooks/useEmitter";
import useEaster from "../../hooks/useEaster";

import NumberBox from "./NumberBox";
import InputBox, { cursor } from "../../components/InputBox";
import SidebarOpener from "../../components/SidebarOpener";
import type Dialog from "../../components/Dialog";
import FunctionDialog from "../../dialogs/FunctionDialog";

const ProgrammingOutput: React.FC = () => {
    const [outputContent, setOutputContent] = useState<string>("");
    const [numberSys, setNumberSys] = useState<NumberSys>(NumberSys.DEC);
    const [hexValue, setHex] = useState<string>("0");
    const [decValue, setDec] = useState<string>("0");
    const [octValue, setOct] = useState<string>("0");
    const [binValue, setBin] = useState<string>("0");
    const inputRef = useRef<InputBox>(null);
    const funcsDialogRef = useRef<Dialog>(null);

    const handleResult = useCallback((currentContent: string) => {
        if(currentContent.split(" ").length <= 1) return;

        // Remove cursor from raw text
        var rawText = InputBox.removeCursor(currentContent);
        var raw = rawText.split(" ");

        var compiler = new Compiler(raw, new Map(), true, numberSys);
        var result = compiler.compile();
        var error = false;

        if(result.indexOf("NaN") > -1 || result === "") error = true;

        // Display the result
        var displayValue: string = result;
        switch(numberSys) {
            case NumberSys.HEX:
                displayValue = Transformer.decToHex(result);
                break;
            case NumberSys.DEC:
                /* Do nothing */
                break;
            case NumberSys.OCT:
                displayValue = Transformer.decToOct(result);
                break;
            case NumberSys.BIN:
                displayValue = Transformer.decToBin(result);
                break;
        }
        if(!error) {
            setOutputContent("=\\text{"+ displayValue +"}");
            Logger.info(rawText.replaceAll(" ", "") +"="+ result);
        } else {
            setOutputContent("=\\text{"+ errorText +"}");
            Logger.error("Error");
        }

        if(error) return;

        // Add the result to history list
        Emitter.get().emit("add-record", rawText, "\\text{"+ displayValue +"}", RecordType.PROGRAMMING, numberSys);

        setHex(Transformer.decToHex(result));
        setDec(result);
        setOct(Transformer.decToOct(result));
        setBin(Transformer.decToBin(result));
    }, [numberSys]);

    const handleInput = useCallback((symbol: string) => {
        if(!inputRef.current) return;
        const inputBox = inputRef.current;
        const currentContent = inputBox.state.displayContent;

        var contentArray = currentContent.split(" ");
        var cursorIndex = inputBox.getCursorIndex();

        switch(symbol) {
            case "\\text{Clear}":
                setOutputContent("");
                return cursor;
            case "Backspace":
            case "\\text{Del}":
                var target = cursorIndex;
                if(contentArray[target] === cursor) {
                    target--;
                    if(target < 0) return;
                }

                contentArray = Utils.arrayRemove(contentArray, target);

                setOutputContent("");
                return contentArray.join(" ");
            case "\\text{CH}":
                Emitter.get().emit("clear-record");
                break;
            case "ArrowLeft":
            case "\\leftarrow":
                if(cursorIndex === 0) return;

                return inputBox.moveCursorTo(cursorIndex - 1);
            case "ArrowRight":
            case "\\rightarrow":
                if(cursorIndex === contentArray.length - 1) return;

                return inputBox.moveCursorTo(cursorIndex + 1);
            case "<":
                setOutputContent("");
                return currentContent.replace(cursor, "\\text{Lsh} "+ cursor);
            case ">":
                setOutputContent("");
                return currentContent.replace(cursor, "\\text{Rsh} "+ cursor);
            case "Enter":
            case "\\text{Result}":
                if(contentArray.length > 1) handleResult(currentContent);
                return;
            default:
                setOutputContent("");

                var transformed = symbol;
                if(
                    (symbol.charCodeAt(0) >= 65 && symbol.charCodeAt(0) <= 70) || // A~F
                    (symbol.charCodeAt(0) >= 97 && symbol.charCodeAt(0) <= 102)   // a~f
                ) {
                    transformed = "\\text{"+ symbol.toUpperCase() +"}";
                }

                if(Is.mathFunction(symbol)) { // Add right bracket automatically
                    setOutputContent("");
                    return currentContent.replace(cursor, transformed +" "+ cursor +" )");
                }
                return currentContent.replace(cursor, transformed +" "+ cursor);
        }
    }, [inputRef, handleResult]);

    useEffect(() => {
        if(outputContent !== "") return;

        setHex("0");
        setDec("0");
        setOct("0");
        setBin("0");
    }, [outputContent]);

    useEmitter([
        ["clear-input", () => setOutputContent("")],
        ["number-sys-chose", (type: NumberSys) => {
            setNumberSys(type);
        }],
        ["history-item-click", (itemInfo: HistoryItemInfo) => {
            if(itemInfo.type !== RecordType.PROGRAMMING) return;
            if(!inputRef.current) return;

            inputRef.current.value = itemInfo.input +" "+ cursor;
            setOutputContent("="+ itemInfo.output);
            Emitter.get().emit("number-sys-chose", itemInfo.numberSys);
        }],
        ["open-funcs-dialog", () => funcsDialogRef.current?.open()],
        ["do-input", (symbol: string) => handleInput(symbol)]
    ]);

    useEaster(setOutputContent); // Sing, Dance, Rap, Basketball

    const { contextMenu, onContextMenu } = useContextMenu(
        <>
            <ContextMenuItem onSelect={() => Emitter.get().emit("clear-input")}>清空</ContextMenuItem>
            <ContextMenuItem onSelect={() => {
                Utils.writeClipboard(
                    Compiler.purifyNumber(outputContent.substring(1)).toUpperCase()
                )
            }}>复制结果</ContextMenuItem>
        </>
    );

    return (
        <>
            <div
                className="output-container"
                onContextMenu={onContextMenu}>
                {/* Mobile only */}
                {Utils.isMobile() && <SidebarOpener />}

                <span className="output-tag">Output</span>

                <ul className="number-box-list">
                    <NumberBox name="Hex" value={hexValue} type={NumberSys.HEX}/>
                    <NumberBox name="Dec" value={decValue} type={NumberSys.DEC}/>
                    <NumberBox name="Oct" value={octValue} type={NumberSys.OCT}/>
                    <NumberBox name="Bin" value={binValue} type={NumberSys.BIN}/>
                </ul>

                <InputBox
                    ref={inputRef}
                    ltr={false}
                    isProgrammingMode={true}
                    onInputSymbol={(symbol) => handleInput(symbol)}/>
                <div className="output-box">
                    <span className="display">
                        {outputContent.split(" ").map((symbol, index) => <BlockMath key={index}>{symbol}</BlockMath>)}
                    </span>
                </div>

                {/* Dialogs */}
                <FunctionDialog ref={funcsDialogRef}/>
            </div>
            {contextMenu}
        </>
    );
}

export default ProgrammingOutput;
