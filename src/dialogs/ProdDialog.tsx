import React, {
    forwardRef,
    useState,
    useEffect,
    useRef,
    useId,
    useCallback
} from "react";
import { BlockMath, InlineMath } from "react-katex";

import useInnerRef from "@/hooks/useInnerRef";

import Emitter from "@/utils/Emitter";
import type { PropsWithRef } from "@/types";

import Dialog from "@/components/Dialog";

interface ProdDialogProps extends PropsWithRef<Dialog> {
    
}

const ProdDialog: React.FC<ProdDialogProps> = forwardRef<Dialog, ProdDialogProps>(
    (props, ref) => {
        const [n, setN] = useState<number>(0);
        const [i, setI] = useState<number>(1);
        const nInput = useRef<HTMLInputElement>(null);
        const iInput = useRef<HTMLInputElement>(null);
        const dialogRef = useInnerRef(ref);

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
        
        const handleSubmit = useCallback(() => {
            Emitter.get().emit("do-input", "\\Pi_{i="+ i +"}^{"+ n +"}(");
            (ref as React.MutableRefObject<Dialog>).current.close();
        }, [n, i, ref]);

        const handleClose = () => {
            if(!nInput.current || !iInput.current) return;

            setN(0);
            setI(1);
            nInput.current.value = iInput.current.value = "0";
        };

        useEffect(() => {
            document.body.addEventListener("keydown", (e: KeyboardEvent) => {
                if(e.key === "Enter" && dialogRef.current?.isOpened) handleSubmit();
            }, { once: true });
        }, [handleSubmit, dialogRef]);

        return (
            <Dialog
                title="乘积"
                height={450}
                className="pre-input-dialog"
                id={"prod-dialog--"+ useId()}
                footer={<button className="footer-button" onClick={() => handleSubmit()}>输入</button>}
                ref={dialogRef as React.LegacyRef<Dialog>}
                onClose={() => handleClose()}>
                <div className="preview-symbol">
                    <BlockMath math={"\\prod_{i="+ i +"}^{"+ n +"} k"}/>
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
            </Dialog>
        );
    }
);

export default ProdDialog;
