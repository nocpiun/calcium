import React, {
    forwardRef,
    useRef,
    useEffect,
    useCallback,
    useContext,
    useId
} from "react";
import { InlineMath } from "react-katex";

import useInnerRef from "@/hooks/useInnerRef";

import Utils from "@/utils/Utils";
import Emitter from "@/utils/Emitter";
import Is from "@/compiler/Is";
import { PropsWithRef, Mode, InputTag } from "@/types";
import { acTable } from "@/global";

import Dialog from "@/components/Dialog";
import InputBox, { cursor, InputSymbol } from "@/components/InputBox";

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
        const dialogRef = useInnerRef(ref);

        const handleSave = useCallback(() => {
            if(!inputRef.current || !dialogRef.current) return;
            const newRawText = inputRef.current.value;

            Emitter.get().emit("set-function", props.index, newRawText, props.id);
            dialogRef.current.close();
        }, [dialogRef, props.index, props.id]);

        const handleClose = () => {
            if(!inputRef.current) return;

            inputRef.current.ctx.reset();
        };

        const handleInput = useCallback((symbol: string) => {
            if(!inputRef.current) return;
            if(mode !== Mode.GRAPHING) return;
            if(!dialogRef.current?.isOpened) return;
            const inputBox = inputRef.current;
    
            var ctx = inputBox.ctx;
            var cursorIndex = ctx.getCursorIndex();
    
            switch(symbol) {
                case "Backspace":
                    ctx.backspace();
                    break;
                case "Enter":
                    handleSave();
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
    
                        ctx.set(lastCharIndex - (key.length - 1), new InputSymbol(value));
                        for(let i = lastCharIndex - 1; i >= lastCharIndex - key.length + 2; i--) {
                            ctx.symbolList = Utils.arrayRemove(ctx.symbolList, i);
                        }
    
                        if(Is.mathFunction(value)) { // Add right bracket automatically
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
                        ctx.input(new InputSymbol(symbol));
                        ctx.input(new InputSymbol(")"), ctx.getCursorIndex() + 1);
                        return;
                    }
    
                    // Default (normal) Input
                    ctx.input(new InputSymbol(symbol));
            }
        }, [inputRef, dialogRef, mode, handleSave]);

        useEffect(() => {
            if(!inputRef.current) return;

            inputRef.current.ctx.setContent(props.value +" "+ cursor);
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

