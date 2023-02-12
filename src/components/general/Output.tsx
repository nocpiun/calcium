/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { BlockMath } from "react-katex";

import { errorText } from "../../global";
import Emitter from "../../utils/Emitter";
import Utils from "../../utils/Utils";
import Compiler from "../../compiler";
import Is from "../../compiler/Is";

import InputBox, { specialSymbols, cursor } from "../InputBox";
import type Dialog from "../Dialog";
import VariableDialog from "../../dialogs/VariableDialog";
import FunctionDialog from "../../dialogs/FunctionDialog";
import AboutDialog from "../../dialogs/AboutDialog";
import ShortcutDialog from "../../dialogs/ShortcutDialog";

const Output: React.FC = () => {
    const [outputContent, setOutputContent] = useState<string>("");
    const variableRef = useRef<Map<string, string>>(new Map<string, string>());
    const inputRef = useRef<InputBox>(null);
    const varsDialogRef = useRef<Dialog>(null);
    const funcsDialogRef = useRef<Dialog>(null);
    const aboutDialogRef = useRef<Dialog>(null);
    const shortcutDialogRef = useRef<Dialog>(null);

    const handleInput = (symbol: string) => {
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
            case "Enter":
            case "\\text{Result}":
                if(contentArray.length > 1) handleResult(currentContent);
                return;
            case "\\text{Vars}":
                varsDialogRef.current?.open();
                break;
            case "\\text{Funcs}":
                funcsDialogRef.current?.open();
                break;
            case "\\text{About}":
                aboutDialogRef.current?.open();
                break;
            case "\\text{Shortcuts}":
                shortcutDialogRef.current?.open();
                break;
            case "i": // Pi or Phi
                if(contentArray[cursorIndex - 1] === "p") { // Pi
                    contentArray[cursorIndex - 1] = "\\pi";
                    return contentArray.join(" ");
                } else if(contentArray[cursorIndex - 2] === "p" && contentArray[cursorIndex - 1] === "h") { // Phi
                    contentArray[cursorIndex - 2] = "\\phi";
                    contentArray = Utils.arrayRemove(contentArray, cursorIndex - 1);
                    return contentArray.join(" ");
                } else {
                    setOutputContent("");
                    return currentContent.replace(cursor, symbol +" "+ cursor);
                }
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
                            contentArray.push(")"); // Add right bracket automatically

                            return contentArray.join(" ");
                        }
                    }
                }

                if(Is.mathFunction(symbol) || symbol === "(") { // Add right bracket automatically
                    setOutputContent("");
                    return currentContent.replace(cursor, symbol +" "+ cursor +" )");
                }
                
                setOutputContent("");
                return currentContent.replace(cursor, symbol +" "+ cursor);
        }
    };

    const handleResult = (currentContent: string) => {
        if(currentContent.split(" ").length <= 1) return;

        // Remove cursor from raw text
        var rawText = InputBox.removeCursor(currentContent);
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

        // Display the result
        if(result.indexOf("Infinity") > -1) result = "\\infty";
        !error
        ? setOutputContent("="+ result)
        : setOutputContent("=\\text{"+ errorText +"}");

        if(error) return;

        // Add the result to history list
        Emitter.get().emit("add-record", rawText, result);
    };

    useEffect(() => {
        Emitter.get().on("clear-input", () => setOutputContent(""));

        document.body.addEventListener("keydown", (e: KeyboardEvent) => {
            if(e.ctrlKey && e.key === "m") { // ctrl + m
                setOutputContent("c^{xk}+c^{trl}"); // I'm iKun
                return;
            }
        });
    }, []);

    return (
        <div className="output-container">
            <span className="output-tag">Output</span>
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
            <VariableDialog variableList={variableRef.current} ref={varsDialogRef}/>
            <FunctionDialog ref={funcsDialogRef}/>
            <AboutDialog ref={aboutDialogRef}/>
            <ShortcutDialog ref={shortcutDialogRef}/>
        </div>
    );
}

export default Output;
