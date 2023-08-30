import React, {
    forwardRef,
    useState,
    useEffect,
    useRef,
    useId,
    useCallback
} from "react";
import { BlockMath, InlineMath } from "react-katex";

import Emitter from "../utils/Emitter";
import type { PropsWithRef } from "../types";

import Dialog from "../components/Dialog";

interface IntDialogProps extends PropsWithRef<Dialog> {
    
}

const IntDialog: React.FC<IntDialogProps> = forwardRef<Dialog, IntDialogProps>(
    (props, ref) => {
        const [a, setA] = useState<number>(0);
        const [b, setB] = useState<number>(0);
        const aInput = useRef<HTMLInputElement>(null);
        const bInput = useRef<HTMLInputElement>(null);

        const handleInputA = () => {
            if(!aInput.current) return;

            const inputValue = parseFloat(aInput.current.value) || 0;
            
            setA(inputValue);
            if(aInput.current.value === "0-" || aInput.current.value === "-") {
                aInput.current.value = "-";
            } else if(!/\d*\.$/.test(aInput.current.value)) {
                aInput.current.value = inputValue.toString();
            }
        };

        const handleInputB = () => {
            if(!bInput.current) return;

            const inputValue = parseFloat(bInput.current.value) || 0;
            
            setB(inputValue);
            if(bInput.current.value === "0-" || bInput.current.value === "-") {
                bInput.current.value = "-";
            } else if(!/\d*\.$/.test(bInput.current.value)) {
                bInput.current.value = inputValue.toString();
            }
        };
        
        const handleSubmit = useCallback(() => {
            Emitter.get().emit("do-input", "\\smallint_{"+ a +"}^{"+ b +"}(");
            (ref as React.MutableRefObject<Dialog>).current.close();
        }, [a, b, ref]);

        const handleClose = () => {
            if(!aInput.current || !bInput.current) return;

            setA(0);
            setB(0);
            aInput.current.value = bInput.current.value = "0";
        };

        useEffect(() => {
            document.body.addEventListener("keydown", (e: KeyboardEvent) => {
                if(e.key === "Enter") handleSubmit();
            }, { once: true });
        }, [handleSubmit]);

        return (
            <Dialog
                title="积分"
                height={450}
                className="pre-input-dialog"
                id={"sum-dialog--"+ useId()}
                ref={ref}
                onClose={() => handleClose()}>
                <div className="preview-symbol">
                    <BlockMath math={"\\smallint_{a="+ a +"}^{b="+ b +"} f(x) dx"}/>
                </div>
                <div className="input-items">
                    <div className="input-item">
                        <div className="input-item-tag">
                            <InlineMath>a =</InlineMath>
                        </div>
                        <input
                            type="text"
                            defaultValue={a}
                            autoComplete="off"
                            ref={aInput}
                            onInput={() => handleInputA()}/>
                    </div>
                    <div className="input-item">
                        <div className="input-item-tag">
                            <InlineMath>b =</InlineMath>
                        </div>
                        <input
                        type="text"
                        defaultValue={b}
                        autoComplete="off"
                        ref={bInput}
                        onInput={() => handleInputB()}/>
                    </div>
                </div>
                <div className="submit-container">
                    <button className="submit-button" onClick={() => handleSubmit()}>输入</button>
                </div>
            </Dialog>
        );
    }
);

export default IntDialog;
