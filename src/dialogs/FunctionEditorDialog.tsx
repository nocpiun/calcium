import React, {
    forwardRef,
    useId
} from "react";
import { InlineMath } from "react-katex";

import type { PropsWithRef } from "@/types";

import Dialog from "@/components/Dialog";

interface FunctionEditorDialogProps extends PropsWithRef<Dialog> {
    index: number
    value: string
}

const FunctionEditorDialog: React.FC<FunctionEditorDialogProps> = forwardRef<Dialog, FunctionEditorDialogProps>(
    (props, ref) => {
        return (
            <Dialog
                title="编辑函数"
                height={450}
                className="function-editor-dialog"
                id={"function-editor-dialog--"+ useId()}
                ref={ref}
                onClose={() => {}}>
                <div className="value-editor">
                    <div className="function-tag">
                        <span><InlineMath>{"y_{"+ (props.index + 1).toString() +"} ="}</InlineMath></span>
                    </div>
                    <div className="function-value">
                        <span><InlineMath>{props.value}</InlineMath></span>
                    </div>
                </div>
            </Dialog>
        );
    }
);

export default FunctionEditorDialog;

