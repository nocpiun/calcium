import React, { forwardRef, useId } from "react";
import { InlineMath } from "react-katex";

import { functions } from "@/global";
import type { PropsWithRef } from "@/types";

import Dialog from "@/components/Dialog";

interface FunctionDialogProps extends PropsWithRef<Dialog> {
    
}

const FunctionDialog: React.FC<FunctionDialogProps> = forwardRef<Dialog, FunctionDialogProps>(
    (props, ref) => {
        return (
            <Dialog title="函数列表" id={"funcs-dialog--"+ useId()} ref={ref}>
                <table>
                    <thead>
                        <tr>
                            <th>函数名</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Array.from(functions).map(([funcName, value], index) => {
                                if(funcName === "%") funcName = "\\%"; // "%" won't display in KaTeX

                                return (
                                    <tr key={index}>
                                        <td>
                                            <InlineMath>
                                                {
                                                    funcName.indexOf("text{") > -1
                                                    ? funcName.replace("text{", "").replace("}", "")
                                                    : funcName
                                                }
                                            </InlineMath>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </Dialog>
        );
    }
);

export default FunctionDialog;
