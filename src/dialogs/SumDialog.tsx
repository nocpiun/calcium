import React, { forwardRef, useState, useRef, useId } from "react";
import { BlockMath, InlineMath } from "react-katex";

import Emitter from "../utils/Emitter";
import type { PropsWithRef } from "../types";

import Dialog from "../components/Dialog";

interface SumDialogProps extends PropsWithRef<Dialog> {
    
}

const SumDialog: React.FC<SumDialogProps> = forwardRef<Dialog, SumDialogProps>(
    (props, ref) => {
        const [n, setN] = useState<number>(0);
        const [i, setI] = useState<number>(0);
        const nInput = useRef<HTMLInputElement>(null);
        const iInput = useRef<HTMLInputElement>(null);

        const handleInputN = () => {
            if(!nInput.current) return;

            const inputValue = parseFloat(nInput.current.value) || 0;
            
            setN(inputValue);
            nInput.current.value = inputValue.toString();
        };

        const handleInputI = () => {
            if(!iInput.current) return;

            const inputValue = parseFloat(iInput.current.value) || 0;
            
            setI(inputValue);
            iInput.current.value = inputValue.toString();
        };
        
        const handleSubmit = () => {
            Emitter.get().emit("do-input", "\\Sigma_{i="+ i +"}^{"+ n +"}(");
            setI(0);
            setN(0);
            (ref as React.MutableRefObject<Dialog>).current.close();
        };

        return (
            <Dialog title="求和" height={450} className="sum-dialog" id={"sum-dialog--"+ useId()} ref={ref}>
                <div className="sigma-symbol">
                    <BlockMath math={"\\sum_{i="+ i +"}^{"+ n +"} k"}/>
                </div>
                <div className="input-items">
                    <div className="input-item">
                        <div className="input-item-tag">
                            <InlineMath>n =</InlineMath>
                        </div>
                        <input
                            type="text"
                            defaultValue={n}
                            autoComplete="off"
                            ref={nInput}
                            onInput={() => handleInputN()}/>
                    </div>
                    <div className="input-item">
                        <div className="input-item-tag">
                            <InlineMath>i =</InlineMath>
                        </div>
                        <input
                        type="text"
                        defaultValue={i}
                        autoComplete="off"
                        ref={iInput}
                        onInput={() => handleInputI()}/>
                    </div>
                </div>
                <div className="submit-container">
                    <button className="submit-button" onClick={() => handleSubmit()}>输入</button>
                </div>
            </Dialog>
        );
    }
);

export default SumDialog;
