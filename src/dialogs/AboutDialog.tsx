import React, { ReactElement, forwardRef, useState, useId } from "react";
import { InlineMath } from "react-katex";

import Emitter from "@/utils/Emitter";
import type { PropsWithRef } from "@/types";
import { version } from "@/global";

import Dialog from "@/components/Dialog";
import IndialogPage from "@/components/IndialogPage";

import ReleasesIndialogPage from "@/dialogs/ReleasesIndialogPage";

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

const dependencies: [string, string][] = [
    ["react@18.2.0", "https://react.dev"],
    ["react-dom@18.2.0", "https://react.dev/reference/react-dom"],
    ["typescript@4.9.4", "https://typescriptlang.org"],
    ["axios@1.5.0", "https://axios-http.com"],
    ["katex@0.16.4", "https://katex.org"],
    ["react-katex@3.0.1", "talyssonoc/react-katex"],
    ["react-svg@16.1.15", "tanem/react-svg"],
    ["react-activation@0.12.4", "CJY0208/react-activation"],
    ["react-tooltip@5.21.3", "https://react-tooltip.com"],
    ["@nocp/toggle@0.5.0", "nocpiun/toggle"],
    ["react-markdown@8.0.7", "https://remarkjs.github.io/react-markdown/"],
    ["react-app-polyfill@3.0.0", "https://create-react-app.dev"],
    ["eslint@8.3.0", "https://eslint.org"],
    ["downloadjs@1.4.7", "rndme/download"],
    ["use-context-menu@0.4.12", "https://use-context-menu.vercel.app"],
    ["tone@14.7.77", "https://tonejs.github.io"],
    ["relationship.js@1.2.3", "mumuy/relationship"],
    ["lambert-w-function@3.0.0", "howion/lambert-w-function"],
    ["chemical-elements@2.0.3", "cheminfo/mass-tools"],
    ["flag-icons@7.1.0", "https://flagicons.lipis.dev"],
    ["webpack@5.64.4", "https://webpack.js.org"],
    ["css-loader@6.5.1", "webpack-contrib/css-loader"],
    ["style-loader@3.3.1", "webpack-contrib/style-loader"],
    ["file-loader@6.2.0", "webpack-contrib/file-loader"],
    ["resolve-url-loader@4.0.0", "bholloway/resolve-url-loader"],
    ["source-map-loader@3.0.0", "webpack-contrib/source-map-loader"],
    ["@babel/core@7.16.0", "https://babeljs.io"],
    ["babel-loader@8.2.3", "https://babeljs.io"],
    ["less@4.1.3", "https://lesscss.org"],
    ["less-loader@11.1.0", "webpack-contrib/less-loader"],
    ["postcss@8.4.4", "https://postcss.org"],
    ["postcss-loader@6.2.1", "webpack-contrib/postcss-loader"],
    ["css-minimizer-webpack-plugin@3.2.0", "webpack-contrib/css-minimizer-webpack-plugin"],
    ["eslint-webpack-plugin@3.1.1", "webpack-contrib/eslint-webpack-plugin"],
    ["html-webpack-plugin@5.5.0", "jantimon/html-webpack-plugin"],
    ["terser-webpack-plugin@5.2.5", "webpack-contrib/terser-webpack-plugin"],
    ["workbox-webpack-plugin@6.4.1", "GoogleChrome/workbox"],
    ["jest@27.4.3", "https://jestjs.io"],
    ["jest-resolve@27.4.2", "https://jestjs.io"],
    ["jest-watch-typeahead@1.0.0", "jest-community/jest-watch-typeahead"],
];

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
        const [isDependencyListVisible, setDependencyListVisible] = useState<boolean>(false);
        const [isReleasesVisible, setReleasesVisible] = useState<boolean>(false);

        return (
            <Dialog title="关于" height={530} className="about-dialog" id={"about-dialog--"+ useId()} ref={ref}>
                <p><img src="/icon.png" alt="icon" width={18}/> <b>Calcium</b> 是一个由React+Typescript编写的基于web的网页计算器.</p>

                <ul>
                    <li><AboutItem name="版本" content={
                        <button onClick={() => {
                            setReleasesVisible(true);
                            new Emitter().emit("release-indialog-open")}}>
                            {version}
                        </button>
                    }/></li>
                    <li><AboutItem name="作者" content="NoahHrreion"/></li>
                    <li><AboutItem name="数学显示" content={<a href="https://katex.org" target="_blank" rel="noreferrer" className="katex-logo"><InlineMath>\KaTeX</InlineMath></a>}/></li>
                    <li><AboutItem name="支持我" content={<a href="https://nin.red/#/donate" target="_blank" rel="noreferrer">打赏</a>}/></li>
                    <li><AboutItem name="Github Repo" content={<a href="https://github.com/nocpiun/calcium" target="_blank" rel="noreferrer">nocpiun/calcium</a>}/></li>
                    <li><AboutItem name="依赖" content={<button onClick={() => setDependencyListVisible(true)}>查看</button>}/></li>
                    <li><AboutItem name="License" content={<button onClick={() => setLicenseVisible(true)}>查看</button>}/></li>
                </ul>

                <p style={{ textAlign: "center" }}>如果有任何问题或想法, 欢迎提交 <a href="https://github.com/nocpiun/calcium/issues" target="_blank" rel="noreferrer">issue</a> 来让我知道.</p>
                <h3 style={{ textAlign: "center" }}>感谢使用 Calcium!</h3>

                <IndialogPage title="License" visible={isLicenseVisible} onBack={() => setLicenseVisible(false)}>
                    <textarea className="license-content" value={licenseContent} disabled/>
                </IndialogPage>

                <IndialogPage title="依赖项" visible={isDependencyListVisible} onBack={() => setDependencyListVisible(false)}>
                    <div className="dependency-list">
                        {
                            dependencies.map((item, index) => {
                                return (
                                    <div className="dependency-item" key={index}>
                                        <p>{item[0]}</p>
                                        {
                                            item[1].indexOf("https://") > -1
                                            ? <a href={item[1]} target="_blank" rel="noreferrer">{item[1]}</a>
                                            : <a href={"https://github.com/"+ item[1]} target="_blank" rel="noreferrer">{item[1]}</a>
                                        }
                                    </div>
                                );
                            })
                        }
                    </div>
                </IndialogPage>

                <IndialogPage title="更新日志" visible={isReleasesVisible} onBack={() => setReleasesVisible(false)}>
                    <ReleasesIndialogPage />
                </IndialogPage>
            </Dialog>
        );
    }
);

export default AboutDialog;
