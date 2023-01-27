import React, { Component, ReactElement } from "react";
import { createPortal } from "react-dom";

import Utils from "../utils/Utils";
import { PropsWithChildren } from "react";

interface DialogProps extends PropsWithChildren {
    title: string
    id: string
}

export default class Dialog extends Component<DialogProps, {}> {
    private dialogRef: React.RefObject<HTMLDialogElement> = React.createRef();

    public open(): void {
        this.dialogRef.current?.showModal();
    }

    public close(): void {
        this.dialogRef.current?.close();
    }

    public render(): ReactElement {
        return createPortal((
            <dialog id={this.props.id} ref={this.dialogRef}>
                <div className="header-container">
                    <h1>{this.props.title}</h1>
                </div>
                <div className="main-container">
                    {
                        this.props.children instanceof Array
                        ? [...this.props.children]
                        : this.props.children
                    }
                </div>
                <div className="footer-container">
                    <button className="footer-button" onClick={() => this.close()} tabIndex={-1}>Close</button>
                </div>
            </dialog>
        ), Utils.getElem("dialogs"));
    }
}
