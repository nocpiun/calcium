import React, {
    useState,
    useEffect,
    useRef,
    useCallback
} from "react";
import { BlockMath, InlineMath } from "react-katex";
import { useContextMenu, ContextMenuItem } from "use-context-menu";

import { HistoryItemInfo } from "@/components/sidebar/History";

import { errorText, acTable } from "@/global";
import Emitter from "@/utils/Emitter";
import Utils from "@/utils/Utils";
import Compiler from "@/compiler/Compiler";
import MathKits from "@/compiler/MathKits";
import Is from "@/compiler/Is";
import Logger from "@/utils/Logger";
import { InputTag, NumberSys, RecordType } from "@/types";

import useEmitter from "@/hooks/useEmitter";
import useEaster from "@/hooks/useEaster";

import InputBox, { cursor, InputSymbol, InputContext } from "@/components/InputBox";
import SidebarOpener from "@/components/SidebarOpener";
import type Dialog from "@/components/Dialog";
import VariableDialog from "@/dialogs/VariableDialog";
import FunctionDialog from "@/dialogs/FunctionDialog";
import SumDialog from "@/dialogs/SumDialog";
import IntDialog from "@/dialogs/IntDialog";
import ProdDialog from "@/dialogs/ProdDialog";
import AtomicWeightsDialog from "@/dialogs/AtomicWeightsDialog";

const Output: React.FC = () => {
    const [outputContent, setOutputContent] = useState<string>("");
    const [isTofrac, setIsTofrac] = useState<boolean>(false);
    const variableRef = useRef<Map<string, string>>(new Map<string, string>());
    const inputRef = useRef<InputBox>(null);
    const varsDialogRef = useRef<Dialog>(null);
    const funcsDialogRef = useRef<Dialog>(null);
    const sumDialogRef = useRef<Dialog>(null);
    const intDialogRef = useRef<Dialog>(null);
    const prodDialogRef = useRef<Dialog>(null);
    const atomDialogRef = useRef<Dialog>(null);

    // MARK: Event Handlers

    const handleTofracSwitch = () => {
        setIsTofrac((current) => !current);
    };

    const handleResult = useCallback((currentContent: string) => {
        if(currentContent.split(" ").length <= 1) return;

        // Remove cursor from raw text
        var rawText = InputContext.removeCursor(currentContent);
        var raw = rawText.split(" ");

        if(rawText === "2 . 5") {
            setOutputContent("2.5c^{trl}"); // Chicken is beautiful
            return;
        }

        if(Is.variable(raw[0]) && raw[1] === "=") { // variable declaring or setting
            const varName = raw[0];

            // Remove variableName and `=`
            raw = Utils.arrayRemove(raw, 0);
            raw = Utils.arrayRemove(raw, 0);

            var variableCompiler = new Compiler(raw, variableRef.current);
            var variableValue = variableCompiler.compile();
            var variableError = false;

            if(variableValue.indexOf("NaN") > -1 || variableValue === "") variableError = true;

            if(!variableError) {
                variableRef.current.set(varName, variableValue);
                setOutputContent(varName +"="+ variableRef.current.get(varName));
            } else {
                setOutputContent(varName +"=\\text{"+ errorText +"}");
            }

            return;
        }

        var compiler = new Compiler(raw, variableRef.current);
        var result = compiler.compile();
        var error = false;

        if(result.indexOf("NaN") > -1 || result === "") error = true;

        // tofrac
        if(isTofrac && result.indexOf(".") > -1 && result.split(".")[1].length <= 7) {
            const [a, b] = MathKits.toFrac(parseFloat(result));
            result = "\\frac{"+ a +"}{"+ b +"}";
        }

        // Display the result
        if(result.indexOf("Infinity") > -1) result = result.replace("Infinity", "\\infty");
        if(!error) {
            setOutputContent("="+ result);
            Logger.info("Calculated: "+ rawText.replaceAll(" ", "") +"="+ result);
        } else {
            setOutputContent("=\\text{"+ errorText +"}");
            Logger.error("Error");
        }

        if(error) return;

        // Add the result to history list
        new Emitter().emit("add-record", rawText, result, RecordType.GENERAL, NumberSys.DEC);
    }, [isTofrac]);

    const handleInput = useCallback((symbol: string) => {
        if(!inputRef.current) return;
        const inputBox = inputRef.current;

        var ctx = inputBox.ctx;
        var cursorIndex = ctx.getCursorIndex();

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
            case "Enter":
            case "\\text{Result}":
                if(ctx.length > 1) handleResult(ctx.getCombined());
                break;
            case "\\sum":
                sumDialogRef.current?.open();
                break;
            case "\\int":
                intDialogRef.current?.open();
                break;
            case "\\prod":
                prodDialogRef.current?.open();
                break;
            case "\\atom":
                atomDialogRef.current?.open();
                break;
            default:
                // Auto complete
                tableLoop: for(let [key, value] of acTable) {
                    if(symbol !== key[key.length - 1]) continue;

                    const lastCharIndex = cursorIndex;
                    for(let i = lastCharIndex - 1; i > lastCharIndex - key.length; i--) {
                        if(i < 0) continue tableLoop;

                        const j = i - (lastCharIndex - key.length + 1);
                        if(ctx.symbolList[i].value !== key[j]) continue tableLoop;
                    }

                    key.length !== 1
                    ? ctx.set(lastCharIndex - (key.length - 1), new InputSymbol(value))
                    : ctx.symbolList = Utils.arrayPut(ctx.symbolList, lastCharIndex, new InputSymbol(value));
                    for(let i = lastCharIndex - 1; i >= lastCharIndex - key.length + 2; i--) {
                        ctx.symbolList = Utils.arrayRemove(ctx.symbolList, i);
                    }

                    if(Is.mathFunction(value)) { // Add right bracket automatically
                        setOutputContent("");

                        ctx.input(new InputSymbol(")"), ctx.getCursorIndex() + 1);
                        return;
                    }

                    return;
                }

                if(
                    (
                        symbol === "(" &&
                        (
                            !(
                                cursorIndex + 1 < ctx.length &&
                                cursorIndex - 1 >= 0 &&
                                ctx.symbolList[cursorIndex + 1].value === ")" &&
                                ctx.symbolList[cursorIndex - 1].value !== "(" &&
                                ctx.symbolList[cursorIndex - 1].tag !== InputTag.FUNC
                            ) ||
                            cursorIndex === ctx.length - 1 ||
                            cursorIndex === 0
                        ) 
                    ) ||
                    Is.mathFunction(symbol)
                ) { // Add right bracket automatically
                    setOutputContent("");

                    ctx.input(new InputSymbol(symbol));
                    ctx.input(new InputSymbol(")"), ctx.getCursorIndex() + 1);
                    return;
                }

                // Default (normal) Input
                setOutputContent("");
                ctx.input(new InputSymbol(symbol));
        }
    }, [inputRef, handleResult]);

    useEffect(() => {
        var pureContent = outputContent.replace("=", "");
        if(pureContent === "\\text{"+ errorText +"}") return;
        if(pureContent === "\\infty") return;

        if(isTofrac && pureContent.indexOf(".") > -1 && pureContent.split(".")[1].length <= 7) {
            setOutputContent("="+ Utils.strToFrac(pureContent));
            return;
        }

        if(!isTofrac && pureContent.indexOf("\\frac{") > -1) {
            setOutputContent("="+ Utils.fracToStr(pureContent));
        }
    }, [isTofrac, outputContent]);

    useEmitter([
        ["clear-input", () => setOutputContent("")],
        ["switch-tofrac", () => handleTofracSwitch()],
        ["history-item-click", (itemInfo: HistoryItemInfo) => {
            if(itemInfo.type !== RecordType.GENERAL) return;
            if(!inputRef.current) return;

            inputRef.current.ctx.setContent(itemInfo.input +" "+ cursor);
            setOutputContent("="+ itemInfo.output);
        }],
        ["open-vars-dialog", () => varsDialogRef.current?.open()],
        ["open-funcs-dialog", () => funcsDialogRef.current?.open()],
        ["do-input", (symbol: string) => inputRef.current?.handleInput(symbol)],
        ["set-content", (inputContent: string, outputContent: string = "") => {
            if(!inputRef.current) return;

            if(inputContent.replaceAll(" ", "").indexOf("\\frac{") > -1) {
                inputContent = Utils.fracToStr(inputContent).split("").join(" ");
            }

            inputRef.current.ctx.setContent(inputContent +" "+ cursor);
            setOutputContent((outputContent.length !== 0 ? "=" : "")+ outputContent);
        }]
    ]);

    useEaster(setOutputContent); // K U N

    // MARK: Dom

    const { contextMenu, onContextMenu } = useContextMenu(
        <>
            <ContextMenuItem onSelect={() => new Emitter().emit("clear-input")}>清空</ContextMenuItem>
            <ContextMenuItem onSelect={() => Utils.writeClipboard(outputContent.substring(1))}>复制结果</ContextMenuItem>
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
                <button className={"tofrac-switcher"+ (isTofrac ? " active" : "")} onClick={() => handleTofracSwitch()}>
                    <InlineMath math="\frac{a}{b}"/>
                </button>
                <InputBox
                    ref={inputRef}
                    ltr={false}
                    highlight={true}
                    onInputSymbol={(symbol) => handleInput(symbol)}/>
                <div className="output-box">
                    <span className="display">
                        {outputContent.split(" ").map((symbol, index) => <BlockMath key={index}>{symbol}</BlockMath>)}
                    </span>
                </div>

                {/* Dialogs */}
                <VariableDialog variableList={variableRef.current} ref={varsDialogRef}/>
                <FunctionDialog ref={funcsDialogRef}/>
                <SumDialog ref={sumDialogRef}/>
                <IntDialog ref={intDialogRef}/>
                <ProdDialog ref={prodDialogRef}/>
                <AtomicWeightsDialog ref={atomDialogRef}/>
            </div>
            {contextMenu}
        </>
    );
}

export default Output;
