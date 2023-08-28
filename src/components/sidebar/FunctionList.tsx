import React, {
    useEffect,
    useRef,
    useContext,
    useReducer,
    useCallback
} from "react";
import { InlineMath } from "react-katex";
import { useContextMenu, ContextMenuItem, ContextMenuDivider } from "use-context-menu";

import useEmitter from "../../hooks/useEmitter";

import SidebarPage from "./SidebarPage";
import InputBox, { specialSymbols, cursor } from "../InputBox";
import FunctionListItem from "./FunctionListItem";

import Emitter from "../../utils/Emitter";
import Logger from "../../utils/Logger";
import Utils from "../../utils/Utils";
import { Mode } from "../../types";

import MainContext from "../../contexts/MainContext";

import IdReducer from "../../reducers/IdReducer";

const maxFunctionAmount: number = 50;

const FunctionList: React.FC = () => {
    const { mode, functionList, setFunctionList } = useContext(MainContext);
    const [unusedId, dispatchId] = useReducer(IdReducer, { id: 0 });
    const inputRef = useRef<InputBox>(null);

    const handleAddFunction = useCallback(async () => {
        if(!inputRef.current) return;
        if(mode !== Mode.GRAPHING) return;
        
        const currentList = await Utils.getCurrentState(setFunctionList);
        if(currentList.length + 1 > maxFunctionAmount) return;
        
        var inputBox = inputRef.current;

        var value = inputBox.value;
        if(value === cursor) return;
        setFunctionList([...currentList, { id: unusedId.id, value }]);
        dispatchId({ type: "refresh", payload: 1 });
        Emitter.get().emit("add-function", value);
        Logger.info("Function rendered: "+ value.replaceAll(" ", ""));

        inputBox.reset();
    }, [inputRef, mode, setFunctionList, unusedId.id]);

    const handleInput = useCallback((symbol: string) => {
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
                /**
                 * Function auto complete
                 * 
                 * For example,
                 * input 'lg', then it will auto complete it as '\lg('
                 * which can be correctly displayed by KaTeX
                 */
                for(let i = 0; i < specialSymbols.length; i++) {
                    var specialSymbol = specialSymbols[i];
                    if(symbol !== specialSymbol[specialSymbol.length - 1]) continue;

                    var splited = specialSymbol.split("");
                    var passed = true;
                    for(let j = splited.length - 2; j >= 0; j--) {
                        if(contentArray[cursorIndex - (splited.length - j) + 1] !== splited[j]) {
                            passed = false;
                        }
                    }

                    if(!passed) continue;

                    switch(specialSymbol) {
                        case "sqrt":
                            specialSymbol = "√(";
                            break;
                        case "cbrt":
                            specialSymbol = "^3√(";
                            break;
                        default:
                            specialSymbol = "\\"+ specialSymbol +"(";
                            break;
                    }

                    var begin = cursorIndex - splited.length + 1;
                    contentArray[begin] = specialSymbol;
                    for(let j = 0; j < splited.length - 2; j++) {
                        contentArray = Utils.arrayRemove(contentArray, begin + 1);
                    }
                    contentArray.push(")"); // Add right bracket automatically

                    return contentArray.join(" ");
                }
                
                return currentContent.replace(cursor, symbol +" "+ cursor);
        }
    }, [inputRef, mode, handleAddFunction]);

    useEffect(() => {
        Utils.scrollToEnd("function-list", 1, 0);
    }, [functionList]);

    useEmitter([
        ["switch-mode", (newMode: Mode) => {
            if(newMode === Mode.GRAPHING) return;

            setFunctionList([]);
        }]
    ]);

    const { contextMenu, onContextMenu, onKeyDown } = useContextMenu(
        <>
            <ContextMenuItem onSelect={() => Emitter.get().emit("clear-function")}>清空列表</ContextMenuItem>
            <ContextMenuDivider />
            <ContextMenuItem onSelect={() => Emitter.get().emit("graphing-capture")}>捕捉图像</ContextMenuItem>
            <ContextMenuItem onSelect={() => Emitter.get().emit("graphing-reload")}>重载</ContextMenuItem>
        </>
    );

    return (
        <>
            <SidebarPage
                id="function-list"
                title="函数列表"
                tip={<>最多添加{maxFunctionAmount}个函数</>} 
                onContextMenu={onContextMenu}
                onKeyDown={onKeyDown}>
                <div className="function-list-main">
                    <div className="function-input-box">
                        <div className="function-input-box-tag">
                            <span><InlineMath>y =</InlineMath></span>
                        </div>
                        <InputBox
                            ref={inputRef}
                            ltr={true}
                            onInputSymbol={(symbol) => handleInput(symbol)}/>
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
            {contextMenu}
        </>
    );
}

export default FunctionList;
