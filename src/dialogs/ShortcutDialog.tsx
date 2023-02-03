import React, { forwardRef, useId } from "react";

import { shortcuts } from "../global";
import type { PropsWithRef } from "../types";

import Dialog from "../components/Dialog";

interface ShortcutDialogProps extends PropsWithRef<Dialog> {
    
}

const ShortcutDialog: React.FC<ShortcutDialogProps> = forwardRef<Dialog, ShortcutDialogProps>(
    (props, ref) => {
        return (
            <Dialog title="Shortcut List" id={"shortcut-dialog--"+ useId()} ref={ref}>
                <table>
                    <thead>
                        <tr>
                            <th>Shortcut</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Array.from(shortcuts).map(([shrotcutKeys, shortcut], index) => {
                                return (
                                    <tr key={index}>
                                        <td><kbd>{shrotcutKeys.join("+")}</kbd></td>
                                        <td>{shortcut.description}</td>
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

export default ShortcutDialog;

