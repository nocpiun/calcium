import React, { ReactElement, forwardRef, useState, useId } from "react";
import { InlineMath } from "react-katex";

import type { PropsWithRef } from "../types";
import { version } from "../global";

import Dialog from "../components/Dialog";
import IndialogPage from "../components/IndialogPage";

const licenseContent = `MIT License

Copyright (c) ${new Date().getFullYear()} NriotHrreion

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

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
        const [isLicenseVisible, setLicenseVisible] = useState<boolean>(false);

        return (
            <Dialog title="About" id={"about-dialog--"+ useId()} ref={ref}>
                <p><img src="/icon.png" alt="icon" width={18}/> <b>Calcium</b> is a web-based calculator written in React+Typescript.</p>

                <ul>
                    <li><AboutItem name="Version" content={version}/></li>
                    <li><AboutItem name="Author" content="NoahHrreion"/></li>
                    <li><AboutItem name="Math Displaying" content={<a href="https://github.com/talyssonoc/react-katex" target="_blank" rel="noreferrer" className="katex-logo"><InlineMath>\KaTeX</InlineMath></a>}/></li>
                    <li><AboutItem name="Webpage" content={<a href="https://calc.nin.red" target="_blank" rel="noreferrer">calc.nin.red</a>}/></li>
                    <li><AboutItem name="Github Repo" content={<a href="https://github.com/nocpiun/calcium" target="_blank" rel="noreferrer">nocpiun/calcium</a>}/></li>
                    <li><AboutItem name="License" content={<button onClick={() => setLicenseVisible(true)}>View</button>}/></li>
                </ul>

                <p>If you have any problem or idea, it's welcome to open an <a href="https://github.com/nocpiun/calcium/issues" target="_blank" rel="noreferrer">issue</a> to let me know.</p>
                <h3 style={{ textAlign: "center" }}>Thank you for using Calcium!</h3>

                <IndialogPage title="License" visible={isLicenseVisible} onBack={() => setLicenseVisible(false)}>
                    <textarea className="license-content" value={licenseContent} disabled/>
                </IndialogPage>
            </Dialog>
        );
    }
);

export default AboutDialog;
