import React, {
    useEffect,
    useRef,
    useContext,
    useReducer,
    useCallback
} from "react";
import { createPortal } from "react-dom";
import { InlineMath } from "react-katex";
import { useContextMenu, ContextMenuItem, ContextMenuDivider } from "use-context-menu";

import useEmitter from "@/hooks/useEmitter";

import SidebarPage from "@/components/sidebar/SidebarPage";
import InputBox, { cursor } from "@/components/InputBox";
import FunctionListItem from "@/components/sidebar/FunctionListItem";
import MobileInput from "@/views/general/MobileInput";

import Is from "@/compiler/Is";
import Emitter from "@/utils/Emitter";
import Logger from "@/utils/Logger";
import Utils from "@/utils/Utils";
import { acTable } from "@/global";
import { Mode } from "@/types";

import MainContext from "@/contexts/MainContext";

import IdReducer from "@/reducers/IdReducer";

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
        Emitter.get().emit("add-function", value, unusedId.id);
        dispatchId({ type: "refresh", payload: 1 });
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
            case "Enter":
                if(contentArray.length > 1) handleAddFunction();
                return;
            default:
                // Auto complete
                tableLoop: for(let [key, value] of acTable) {
                    if(symbol !== key[key.length - 1]) continue;

                    const lastCharIndex = cursorIndex;
                    for(let i = lastCharIndex - 1; i > lastCharIndex - key.length; i--) {
                        if(i < 0) continue tableLoop;

                        const j = i - (lastCharIndex - key.length + 1);
                        if(contentArray[i] !== key[j]) continue tableLoop;
                    }

                    contentArray[lastCharIndex - (key.length - 1)] = value;
                    for(let i = lastCharIndex - 1; i >= lastCharIndex - key.length + 2; i--) {
                        contentArray = Utils.arrayRemove(contentArray, i);
                    }

                    if(Is.mathFunction(value)) { // Add right bracket automatically
                        return contentArray.join(" ").replace(cursor, cursor +" )");
                    }

                    return contentArray.join(" ");
                }

                if(symbol === "(" || Is.mathFunction(symbol)) { // Add right bracket automatically
                    return currentContent.replace(cursor, symbol +" "+ cursor +" )");
                }

                // Default (normal) Input
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

    const { contextMenu, onContextMenu } = useContextMenu(
        <>
            <ContextMenuItem onSelect={() => Emitter.get().emit("clear-function")}>清空列表</ContextMenuItem>
            <ContextMenuDivider />
            <ContextMenuItem onSelect={() => Emitter.get().emit("graphing-capture")}>捕捉图像</ContextMenuItem>
            <ContextMenuItem onSelect={() => Emitter.get().emit("graphing-reload")}>重载</ContextMenuItem>
        </>
    );

    const mainSection = (
        <>
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
            {Utils.isMobile() && <MobileInput isGraphingMode={true}/>}
        </>
    );

    return (
        <>
            <SidebarPage
                id="function-list"
                title="函数列表"
                tip={<>最多添加{maxFunctionAmount}个函数</>} 
                onContextMenu={onContextMenu}>
                <div className="function-list-main">{mainSection}</div>
            </SidebarPage>
            {contextMenu}

            {/* Portal to `/src/views/graphing/index.tsx` */}
            {Utils.isMobile() && createPortal(mainSection, Utils.getElem("graphing-input"))}
        </>
    );
}

export default FunctionList;
