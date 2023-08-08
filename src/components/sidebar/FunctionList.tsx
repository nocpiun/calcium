import React, {
    useEffect,
    useRef,
    useContext,
    useReducer
} from "react";
import { InlineMath } from "react-katex";

import useEmitter from "../../hooks/useEmitter";

import SidebarPage from "./SidebarPage";
import InputBox, { specialSymbols, cursor } from "../InputBox";
import FunctionListItem from "./FunctionListItem";

import Emitter from "../../utils/Emitter";
import Logger from "../../utils/Logger";
import Utils from "../../utils/Utils";
import {
    IdReducerStateType,
    IdReducerActionType,
    Mode
} from "../../types";

import MainContext from "../../contexts/MainContext";

function idReducer(state: IdReducerStateType, action: IdReducerActionType) {
    switch(action.type) {
        case "refresh":
            return { id: state.id + action.payload };
        default:
            return { id: state.id };
    }
}

const FunctionList: React.FC = () => {
    const { mode, functionList, setFunctionList } = useContext(MainContext);
    const [unusedId, dispatchId] = useReducer(idReducer, { id: 0 });
    const inputRef = useRef<InputBox>(null);

    const handleAddFunction = async () => {
        if(!inputRef.current) return;
        if(mode !== Mode.GRAPHING) return;
        const currentList = await Utils.getCurrentState(setFunctionList);
        var inputBox = inputRef.current;

        var value = inputBox.value;
        if(value === cursor) return;
        setFunctionList([...currentList, { id: unusedId.id, value }]);
        dispatchId({ type: "refresh", payload: 1 });
        Emitter.get().emit("add-function", value);
        Logger.info("Function rendered: "+ value.replaceAll(" ", ""));

        inputBox.reset();
    };

    const handleInput = (symbol: string) => {
        if(!inputRef.current) return;
        if(mode !== Mode.GRAPHING) return;
        const inputBox = inputRef.current;
        const currentContent = inputBox.state.displayContent;

        var contentArray = currentContent.split(" ");
        var cursorIndex = inputBox.getCursorIndex();

        switch(symbol) {
            case "Backspace":
                var target = cursorIndex;
                if(contentArray[target] === cursor) {
                    target--;
                    if(target < 0) return;
                }

                contentArray = Utils.arrayRemove(contentArray, target);

                return contentArray.join(" ");
            case "ArrowLeft":
                if(cursorIndex === 0) return;

                return inputBox.moveCursorTo(cursorIndex - 1);
            case "ArrowRight":
                if(cursorIndex === contentArray.length - 1) return;

                return inputBox.moveCursorTo(cursorIndex + 1);
            case "Enter":
                if(contentArray.length > 1) handleAddFunction();
                return;
            case "i": // Pi
                if(contentArray[cursorIndex - 1] === "p") {
                    contentArray[cursorIndex - 1] = "\\pi";
                    return contentArray.join(" ");
                } else {

                    return currentContent.replace(cursor, symbol +" "+ cursor);
                }
            default:
                /**
                 * Function auto complete
                 * 
                 * For example,
                 * input 'lg', then it will auto complete it as '\lg('
                 * which can be correctly displayed by KaTeX
                 */
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
                            if(specialSymbol === "sqrt") {
                                specialSymbol = "√(";
                            } else if(specialSymbol === "cbrt") {
                                specialSymbol = "^3√(";
                            } else {
                                specialSymbol = "\\"+ specialSymbol +"(";
                            }

                            var begin = cursorIndex - splited.length + 1;
                            contentArray[begin] = specialSymbol;
                            for(let j = 0; j < splited.length - 2; j++) {
                                contentArray = Utils.arrayRemove(contentArray, begin + 1);
                            }
                            contentArray.push(")"); // Add right bracket automatically

                            return contentArray.join(" ");
                        }
                    }
                }
                
                return currentContent.replace(cursor, symbol +" "+ cursor);
        }
    };

    useEffect(() => {
        Utils.scrollToEnd("function-list", 1, 0);
    }, [functionList]);

    useEmitter([
        ["switch-mode", (newMode: Mode) => {
            if(newMode === Mode.GRAPHING) return;

            setFunctionList([]);
        }]
    ]);

    return (
        <SidebarPage id="function-list" title="函数列表">
            <div className="function-list-main">
                <div className="function-input-box">
                    <div className="function-input-box-tag">
                        <span><InlineMath>y =</InlineMath></span>
                    </div>
                    <InputBox
                        ref={inputRef}
                        ltr={true}
                        onInput={(symbol) => handleInput(symbol)}/>
                    <div className="add-button-container">
                        <button className="add-button" onClick={() => handleAddFunction()}>
                            <span>添加</span>
                        </button>
                    </div>
                </div>
                <div className="function-list" id="function-list">
                    {
                        functionList.map((item, index) => <FunctionListItem {...item} index={index} key={index}/>)
                    }
                </div>
            </div>
        </SidebarPage>
    );
}

export default FunctionList;
