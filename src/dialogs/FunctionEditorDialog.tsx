import React, {
    forwardRef,
    useRef,
    useEffect,
    useCallback,
    useContext,
    useId
} from "react";
import { InlineMath } from "react-katex";

import useCombinedRefs from "@/hooks/useCombinedRefs";

import Utils from "@/utils/Utils";
import Emitter from "@/utils/Emitter";
import Is from "@/compiler/Is";
import { PropsWithRef, Mode } from "@/types";
import { acTable } from "@/global";

import Dialog from "@/components/Dialog";
import InputBox, { cursor } from "@/components/InputBox";

import MainContext from "@/contexts/MainContext";

interface FunctionEditorDialogProps extends PropsWithRef<Dialog> {
    index: number
    id: number
    value: string
}

const FunctionEditorDialog: React.FC<FunctionEditorDialogProps> = forwardRef<Dialog, FunctionEditorDialogProps>(
    (props, ref) => {
        const { mode } = useContext(MainContext);
        const inputRef = useRef<InputBox>(null);
        const innerDialogRef = useRef<Dialog>();
        const dialogRef = useCombinedRefs(innerDialogRef, ref as React.MutableRefObject<Dialog | undefined>);

        const handleSave = useCallback(() => {
            if(!inputRef.current || !dialogRef.current) return;
            const newRawText = inputRef.current.value;

            Emitter.get().emit("set-function", props.index, newRawText, props.id);
            dialogRef.current.close();
        }, [dialogRef, props.index, props.id]);

        const handleClose = () => {
            if(!inputRef.current) return;

            inputRef.current.value = props.value +" "+ cursor;
        };

        const handleInput = useCallback((symbol: string) => {
            if(!inputRef.current) return;
            if(mode !== Mode.GRAPHING) return;
            if(!dialogRef.current?.isOpened) return;
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
                    handleSave();
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
        }, [inputRef, dialogRef, mode, handleSave]);

        useEffect(() => {
            if(!inputRef.current) return;

            inputRef.current.value = props.value +" "+ cursor;
        }, [inputRef, props.value]);

        return (
            <Dialog
                title="编辑函数"
                height={450}
                className="function-editor-dialog"
                id={"function-editor-dialog--"+ useId() +"--"+ props.id}
                footer={<button className="footer-button" onClick={() => handleSave()} tabIndex={-1}>保存</button>}
                ref={dialogRef as React.LegacyRef<Dialog>}
                onClose={() => handleClose()}>
                <div className="value-editor">
                    <div className="function-tag">
                        <span><InlineMath>{"y_{"+ (props.index + 1).toString() +"} ="}</InlineMath></span>
                    </div>
                    <div className="function-value">
                        <InputBox
                            ref={inputRef}
                            ltr={true}
                            shouldAvoidDialog={false}
                            onInputSymbol={(symbol) => handleInput(symbol)}/>
                    </div>
                </div>
            </Dialog>
        );
    }
);

export default FunctionEditorDialog;

