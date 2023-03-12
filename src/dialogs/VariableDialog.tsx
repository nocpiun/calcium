import React, { forwardRef, useId } from "react";
import { InlineMath } from "react-katex";

import { constants } from "../global";
import type { PropsWithRef } from "../types";

import Dialog from "../components/Dialog";

interface VariableDialogProps extends PropsWithRef<Dialog> {
    variableList: Map<string, string>
}

const VariableDialog: React.FC<VariableDialogProps> = forwardRef<Dialog, VariableDialogProps>(
    (props, ref) => {
        return (
            <Dialog title="变量列表" id={"vars-dialog--"+ useId()} ref={ref}>
                <table>
                    <thead>
                        <tr>
                            <th>变量名</th>
                            <th>变量值</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Array.from(constants).map(([constName, value], index) => {
                                return (
                                    <tr key={index}>
                                        <td>
                                            <InlineMath>{constName}</InlineMath>
                                        </td>
                                        <td>{value}</td>
                                    </tr>
                                );
                            })
                        }
                        {
                            Array.from(props.variableList).map(([varName, value], index) => {
                                return (
                                    <tr key={index}>
                                        <td>
                                            <InlineMath>{varName}</InlineMath>
                                        </td>
                                        <td>{value}</td>
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

export default VariableDialog;
