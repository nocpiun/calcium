import React, {
    useState,
    useReducer,
    useRef,
    useCallback
} from "react";
import { BlockMath } from "react-katex";
import { useContextMenu, ContextMenuItem } from "use-context-menu";

import { HistoryItemInfo } from "@/components/sidebar/History";

import { errorText } from "@/global";
import { NumberSys } from "@/types";
import Emitter from "@/utils/Emitter";
import Utils from "@/utils/Utils";
import Compiler from "@/compiler/Compiler";
import Is from "@/compiler/Is";
import Transformer from "@/compiler/Transformer";
import Logger from "@/utils/Logger";
import { RecordType } from "@/types";

import useEmitter from "@/hooks/useEmitter";
import useEaster from "@/hooks/useEaster";

import NumberSysReducer from "@/reducers/NumberSysReducer";

import NumberBox from "./NumberBox";
import InputBox, { cursor, InputSymbol, InputContext } from "@/components/InputBox";
import SidebarOpener from "@/components/SidebarOpener";
import type Dialog from "@/components/Dialog";
import FunctionDialog from "@/dialogs/FunctionDialog";

const ProgrammingOutput: React.FC = () => {
    const [outputContent, setOutputContent] = useState<string>("");
    const [numberSys, setNumberSys] = useState<NumberSys>(NumberSys.DEC);
    const [numberValues, dispatchNumberValue] = useReducer(NumberSysReducer, {
        hex: "0",
        dec: "0",
        oct: "0",
        bin: "0"
    });
    const inputRef = useRef<InputBox>(null);
    const funcsDialogRef = useRef<Dialog>(null);

    // MARK: Event Handlers

    const handleResult = useCallback((currentContent: string) => {
        if(currentContent.split(" ").length <= 1) return;

        // Remove cursor from raw text
        var rawText = InputContext.removeCursor(currentContent);
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
        new Emitter().emit("add-record", rawText, "\\text{"+ displayValue +"}", RecordType.PROGRAMMING, numberSys);

        // Update the values of all number systems
        dispatchNumberValue({ type: "set", payload: result });
    }, [numberSys]);

    const handleInput = useCallback((symbol: string) => {
        if(!inputRef.current) return;
        const inputBox = inputRef.current;

        var ctx = inputBox.ctx;

        switch(symbol) {
            case "Backspace":
            case "\\text{Del}":
                ctx.backspace();

                setOutputContent("");
                break;
            case "\\text{Clear}":
                ctx.reset();

                setOutputContent("");
                break;
            case "\\text{CH}":
                new Emitter().emit("clear-record");
                break;
            case "<":
                setOutputContent("");

                ctx.input(new InputSymbol("\\text{Lsh}"));
                break;
            case ">":
                setOutputContent("");

                ctx.input(new InputSymbol("\\text{Rsh}"));
                break;
            case "Enter":
            case "\\text{Result}":
                if(ctx.symbolList.length > 1) handleResult(ctx.getCombined());
                break;
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

                    ctx.input(new InputSymbol(transformed));
                    ctx.input(new InputSymbol(")"), ctx.getCursorIndex() + 1);
                    return;
                }

                ctx.input(new InputSymbol(transformed));
        }
    }, [inputRef, handleResult]);

    new Emitter().on("number-sys-chose", (type: NumberSys) => {
        setNumberSys(type);

        const value = numberValues[type];

        if(!inputRef.current || value === "0") return;
        inputRef.current.ctx.setContent(Utils.rawHexTextToKatex(value) +" "+ cursor);
        setOutputContent("");
        dispatchNumberValue({ type: "set", payload: numberValues.dec });
    });

    useEmitter([
        ["clear-input", () => setOutputContent("")],
        ["history-item-click", (itemInfo: HistoryItemInfo) => {
            if(itemInfo.type !== RecordType.PROGRAMMING) return;
            if(!inputRef.current) return;

            inputRef.current.ctx.setContent(itemInfo.input +" "+ cursor);
            setOutputContent("="+ itemInfo.output);
            new Emitter().emit("number-sys-chose", itemInfo.numberSys);
        }],
        ["open-funcs-dialog", () => funcsDialogRef.current?.open()],
        ["do-input", (symbol: string) => handleInput(symbol)]
    ]);

    useEaster(setOutputContent); // Sing, Dance, Rap, Basketball

    // MARK: Dom

    const { contextMenu, onContextMenu } = useContextMenu(
        <>
            <ContextMenuItem onSelect={() => new Emitter().emit("clear-input")}>清空</ContextMenuItem>
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
                    {Object.keys(numberValues).map((key, index) => {
                        return <NumberBox
                            type={key as NumberSys}
                            value={numberValues[key as keyof typeof numberValues]}
                            key={index}/>;
                    })}
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
