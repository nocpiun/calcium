/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { BlockMath } from "react-katex";

import { errorText } from "../../global";
import { NumberSys } from "../../types";
import Emitter from "../../utils/Emitter";
import Utils from "../../utils/Utils";
import Compiler from "../../compiler";
import Transformer from "../../compiler/Transformer";

import NumberBox from "./NumberBox";
import InputBox, { cursor } from "../InputBox";
import type Dialog from "../Dialog";
import FunctionDialog from "../../dialogs/FunctionDialog";
import AboutDialog from "../../dialogs/AboutDialog";

const ProgrammingOutput: React.FC = () => {
    const [outputContent, setOutputContent] = useState<string>("");
    const [numberSys, setNumberSys] = useState<NumberSys>(NumberSys.DEC);
    const [hexValue, setHex] = useState<string>("0");
    const [decValue, setDec] = useState<string>("0");
    const [octValue, setOct] = useState<string>("0");
    const [binValue, setBin] = useState<string>("0");
    const inputRef = useRef<InputBox>(null);
    const funcsDialogRef = useRef<Dialog>(null);
    const aboutDialogRef = useRef<Dialog>(null);

    const handleInput = (symbol: string) => {
        if(!inputRef.current) return;
        const inputBox = inputRef.current;
        const currentContent = inputBox.state.displayContent;

        var contentArray = currentContent.split(" ");
        var cursorIndex = inputBox.getCursorIndex();

        switch(symbol) {
            case "\\text{Clear}":
                inputBox.reset();
                setOutputContent("");
                break;
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
                /** @todo */
                // Emitter.get().emit("add-record", undefined, undefined);
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
            case "\\text{Funcs}":
                funcsDialogRef.current?.open();
                break;
            case "\\text{About}":
                aboutDialogRef.current?.open();
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
                return currentContent.replace(cursor, transformed +" "+ cursor);
        }
    };

    const handleResult = (currentContent: string) => {
        if(currentContent.split(" ").length <= 1) return;

        // Remove cursor from raw text
        var rawText = InputBox.removeCursor(currentContent);
        var raw = rawText.split(" ");

        var compiler = new Compiler(raw, new Map(), true);
        var formula = compiler.compile();
        var result = "";
        var error = false;

        if(formula) {
            switch(numberSys) {
                case NumberSys.HEX:
                    result = formula.evaluateHex();
                    break;
                case NumberSys.DEC:
                    result = formula.evaluateDec();
                    break;
                case NumberSys.OCT:
                    result = formula.evaluateOct();
                    break;
                case NumberSys.BIN:
                    result = formula.evaluateBin();
                    break;
            }

            if(result.indexOf("NaN") > -1 || result === "") error = true;
        } else {
            error = true;
        }

        // Display the result
        !error
        ? setOutputContent("=\\text{"+ result +"}")
        : setOutputContent("=\\text{"+ errorText +"}");

        if(error) return;

        // Add the result to history list
        Emitter.get().emit("add-record", rawText, "\\text{"+ result +"}");

        switch(numberSys) {
            case NumberSys.HEX:
                setHex(result);
                setDec(Transformer.hexToDec(result));
                setOct(Transformer.hexToOct(result));
                setBin(Transformer.hexToBin(result));
                break;
            case NumberSys.DEC:
                setHex(Transformer.decToHex(result));
                setDec(result);
                setOct(Transformer.decToOct(result));
                setBin(Transformer.decToBin(result));
                break;
            case NumberSys.OCT:
                setHex(Transformer.octToHex(result));
                setDec(Transformer.octToDec(result));
                setOct(result);
                setBin(Transformer.octToBin(result));
                break;
            case NumberSys.BIN:
                setHex(Transformer.binToHex(result));
                setDec(Transformer.binToDec(result));
                setOct(Transformer.binToOct(result));
                setBin(result);
                break;
        }
    };

    useEffect(() => {
        Emitter.get().on("number-sys-chose", (type: NumberSys) => {
            setNumberSys(type);
        });
    }, []);

    useEffect(() => {
        if(outputContent !== "") return;

        setHex("0");
        setDec("0");
        setOct("0");
        setBin("0");
    }, [outputContent]);

    return (
        <div className="output-container">
            <span className="output-tag">Output</span>

            <ul className="number-box-list">
                <NumberBox name="Hex" value={hexValue} type={NumberSys.HEX}/>
                <NumberBox name="Dec" value={decValue} type={NumberSys.DEC}/>
                <NumberBox name="Oct" value={octValue} type={NumberSys.OCT}/>
                <NumberBox name="Bin" value={binValue} type={NumberSys.BIN}/>
            </ul>

            <InputBox
                ref={inputRef}
                ltr={true}
                onInput={(symbol) => handleInput(symbol)}/>
            <div className="output-box">
                <span className="display">
                    {outputContent.split(" ").map((symbol, index) => <BlockMath key={index}>{symbol}</BlockMath>)}
                </span>
            </div>

            {/* Dialogs */}
            <FunctionDialog ref={funcsDialogRef}/>
            <AboutDialog ref={aboutDialogRef}/>
        </div>
    );
}

export default ProgrammingOutput;
