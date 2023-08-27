import React, {
    useState,
    useRef,
    useContext
} from "react";

import useEmitter from "../../hooks/useEmitter";

import BarItem from "./BarItem";
import Dialog from "../Dialog";
import AboutDialog from "../../dialogs/AboutDialog";
import ShortcutDialog from "../../dialogs/ShortcutDialog";
import ConvertingDialog from "../../dialogs/ConvertingDialog";

import Emitter from "../../utils/Emitter";
import { version } from "../../global";
import { Mode } from "../../types";

import MainContext from "../../contexts/MainContext";

const StatusBar: React.FC = () => {
    const { mode } = useContext(MainContext);
    const [fps, setFPS] = useState<number>(0);
    const aboutDialogRef = useRef<Dialog>(null);
    const shortcutDialogRef = useRef<Dialog>(null);
    const convertingDialogRef = useRef<Dialog>(null);

    useEmitter([
        ["graphing-fps", (currentFPS: number) => setFPS(currentFPS)]
    ]);

    return (
        <>
            <footer className="status-bar">
                <div className="split">
                    <BarItem title="Star" to="https://github.com/nocpiun/calcium" className="primary" tooltip="为本项目加星"/>
                    <BarItem title="反馈" to="https://github.com/nocpiun/calcium/issues" tooltip="Issues"/>
                </div>
                <div className="split">
                    {
                        mode === Mode.GENERAL &&
                        <BarItem title="变量" onClick={() => Emitter.get().emit("open-vars-dialog")} tooltip="查看变量列表"/>
                    }
                    {
                        (mode === Mode.GENERAL || mode === Mode.PROGRAMMING) &&
                        <BarItem title="函数" onClick={() => Emitter.get().emit("open-funcs-dialog")} tooltip="查看函数列表"/>
                    }
                    {
                        mode === Mode.GRAPHING &&
                        <BarItem title={"FPS: "+ fps.toFixed(0)} disabled/>
                    }
                    {
                        mode === Mode.GRAPHING &&
                        <BarItem title="捕捉图像" onClick={() => Emitter.get().emit("graphing-capture")} tooltip="捕捉并下载函数图像"/>
                    }
                    {
                        mode === Mode.GRAPHING &&
                        <BarItem title="重载" onClick={() => Emitter.get().emit("graphing-reload")} tooltip="函数图像渲染重载"/>
                    }
                    <BarItem title="单位换算" onClick={() => convertingDialogRef.current?.open()}/>
                    <BarItem title="快捷键" onClick={() => shortcutDialogRef.current?.open()}/>
                    <BarItem title={"Calcium "+ version} onClick={() => aboutDialogRef.current?.open()}/>
                </div>
            </footer>

            {/* Dialogs */}
            <AboutDialog ref={aboutDialogRef}/>
            <ShortcutDialog ref={shortcutDialogRef}/>
            <ConvertingDialog ref={convertingDialogRef}/>
        </>
    );
}

export default StatusBar;
