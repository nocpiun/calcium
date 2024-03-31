import React, { forwardRef, useState, useEffect, useCallback, useId } from "react";

import AtomicWeightsPage from "@/views/atomic-weights/AtomicWeightsPage";

import Emitter from "@/utils/Emitter";
import type { PropsWithRef } from "@/types";
import Dialog from "@/components/Dialog";
import Utils from "@/utils/Utils";

import AtomicWeightsContext from "@/contexts/AtomicWeightsContext";
import useInnerRef from "@/hooks/useInnerRef";

interface AtomicWeightsDialogProps extends PropsWithRef<Dialog> {
    
}

const AtomicWeightsDialog: React.FC<AtomicWeightsDialogProps> = forwardRef<Dialog, AtomicWeightsDialogProps>(
    (props, ref) => {
        const [result, setResult] = useState<number>(0);
        const dialogRef = useInnerRef(ref);

        const handleClose = () => {
            new Emitter().emit("atomic-weights-dialog-close");
        };

        const handleBackspace = () => {
            new Emitter().emit("atom-backspace");
        };

        const handleClear = () => {
            new Emitter().emit("atom-clear");
        };

        const handleSubmit = useCallback(async () => {
            const numbers = (await Utils.getCurrentState(setResult)).toString().split("");
            numbers.forEach((symbol) => new Emitter().emit("do-input", symbol));

            (ref as React.MutableRefObject<Dialog>).current.close();
        }, [ref, setResult]);

        useEffect(() => {
            document.body.addEventListener("keydown", (e: KeyboardEvent) => {
                if(e.key === "Enter" && dialogRef.current?.isOpened) handleSubmit();
            });
        }, [handleSubmit, dialogRef]);

        return (
            <Dialog
                title="相对原子质量"
                className="atomic-weights-dialog"
                id={"atomic-weights-dialog--"+ useId()}
                footer={
                    <>
                        <button className="footer-button" onClick={() => handleClear()}>清空</button>
                        <button className="footer-button" onClick={() => handleBackspace()}>删除</button>
                        <button className="footer-button" onClick={() => handleSubmit()}>输入</button>
                    </>
                }
                onClose={() => handleClose()}
                ref={dialogRef as React.LegacyRef<Dialog>}>
                <AtomicWeightsContext.Provider value={{ result, setResult }}>
                    <AtomicWeightsPage />
                </AtomicWeightsContext.Provider>
            </Dialog>
        );
    }
);

export default AtomicWeightsDialog;
