import React, { forwardRef, useId } from "react";

import SeniorityPage from "@/views/seniority/SeniorityPage";

import Emitter from "@/utils/Emitter";
import type { PropsWithRef } from "@/types";
import Dialog from "@/components/Dialog";

interface SeniorityDialogProps extends PropsWithRef<Dialog> {
    
}

const SeniorityDialog: React.FC<SeniorityDialogProps> = forwardRef<Dialog, SeniorityDialogProps>(
    (props, ref) => {
        const handleClose = () => {
            Emitter.get().emit("seniority-dialog-close");
        };

        return (
            <Dialog title="辈分计算 (Beta)" className="seniority-dialog" id={"seniority-dialog--"+ useId()} onClose={() => handleClose()} ref={ref}>
                <SeniorityPage />
            </Dialog>
        );
    }
);

export default SeniorityDialog;
