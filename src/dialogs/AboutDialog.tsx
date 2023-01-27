import React, { ReactElement, forwardRef, useId } from "react";
import { InlineMath } from "react-katex";

import { PropsWithRef } from "../types";
import { version } from "../global";

import Dialog from "../components/Dialog";

interface AboutDialogProps extends PropsWithRef<Dialog> {
    
}

interface AboutItemProps {
    name: string
    content: string | ReactElement
}

const AboutItem: React.FC<AboutItemProps> = (props) => {
    return (
        <>
            <span className="item-name">{props.name}</span>
            <span className="item-content">{props.content}</span>
        </>
    );
}

const AboutDialog: React.FC<AboutDialogProps> = forwardRef<Dialog, AboutDialogProps>(
    (props, ref) => {
        return (
            <Dialog title="About" id={"about-dialog--"+ useId()} ref={ref}>
                <p><b>Calcium</b> is a web-based calculator written in React+Typescript.</p>

                <ul>
                    <li><AboutItem name="Version" content={version}/></li>
                    <li><AboutItem name="Author" content="NoahHrreion"/></li>
                    <li><AboutItem name="Math Displaying" content={<InlineMath>\KaTeX</InlineMath>}/></li>
                    <li><AboutItem name="Webpage" content={<a href="https://calc.nin.red" target="_blank" rel="noreferrer">calc.nin.red</a>}/></li>
                    <li><AboutItem name="Github Repo" content={<a href="https://github.com/nocpiun/calcium" target="_blank" rel="noreferrer">nocpiun/calcium</a>}/></li>
                </ul>

                <p>If you have any problem or idea, it's welcome to open an <a href="https://github.com/nocpiun/calcium/issues" target="_blank" rel="noreferrer">issue</a> to let me know.</p>
                <h3 style={{ textAlign: "center" }}>Thank you for using Calcium!</h3>
            </Dialog>
        );
    }
);

export default AboutDialog;
