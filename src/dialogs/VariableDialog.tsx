import React, { forwardRef, useId } from "react";
import { InlineMath } from "react-katex";

import type { PropsWithRef } from "../types";

import Dialog from "../components/Dialog";

interface VariableDialogProps extends PropsWithRef<Dialog> {
    variableList: Map<string, string>
}

const VariableDialog: React.FC<VariableDialogProps> = forwardRef<Dialog, VariableDialogProps>(
    (props, ref) => {
        return (
            <Dialog title="Variables" id={"vars-dialog--"+ useId()} ref={ref}>
                <table>
                    <thead>
                        <tr>
                            <th>Variable Name</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <InlineMath>\pi</InlineMath>
                            </td>
                            <td>{Math.PI}</td>
                        </tr>
                        <tr>
                            <td>
                                <InlineMath>e</InlineMath>
                            </td>
                            <td>{Math.E}</td>
                        </tr>
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
