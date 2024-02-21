import React, { forwardRef, useId } from "react";

import type { PropsWithRef } from "@/types";
import Dialog from "@/components/Dialog";
import CurrencyPage from "@/views/currency/CurrencyPage";

interface CurrencyDialogProps extends PropsWithRef<Dialog> {
    
}

const CurrencyDialog: React.FC<CurrencyDialogProps> = forwardRef<Dialog, CurrencyDialogProps>(
    (props, ref) => {
        return (
            <Dialog
                title="汇率转换"
                className="currency-dialog"
                id={"currency-dialog--"+ useId()}
                ref={ref}>
                <CurrencyPage />
            </Dialog>
        );
    }
);

export default CurrencyDialog;
