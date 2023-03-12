import React, {
    useState,
    useRef,
    useEffect,
    useContext
} from "react";

import BarItem from "./BarItem";
import Dialog from "../Dialog";
import AboutDialog from "../../dialogs/AboutDialog";
import ShortcutDialog from "../../dialogs/ShortcutDialog";

import Emitter from "../../utils/Emitter";
import { version } from "../../global";
import { Mode } from "../../types";

import MainContext from "../../contexts/MainContext";

const StatusBar: React.FC = () => {
    const { mode } = useContext(MainContext);
    const [fps, setFPS] = useState<number>(0);
    const aboutDialogRef = useRef<Dialog>(null);
    const shortcutDialogRef = useRef<Dialog>(null);

    useEffect(() => {
        Emitter.get().on("graphing-fps", (currentFPS: number) => {
            setFPS(currentFPS);
        });
    }, []);

    return (
        <>
            <footer className="status-bar">
                <div className="split">
                    <BarItem title="Star" to="https://github.com/nocpiun/calcium" className="primary" tooltip="为本项目加星"/>
                    <BarItem title="反馈" to="https://github.com/nocpiun/calcium/issues" tooltip="Issues"/>
                </div>
                <div className="split">
                    {
                        mode === Mode.GRAPHING
                        ? <BarItem title={"FPS: "+ fps.toFixed(0)} disabled/>
                        : <></>
                    }
                    <BarItem title="重载" onClick={() => Emitter.get().emit("graphing-reload")} tooltip="Reload Graphing Worker"/>
                    <BarItem title="快捷键" onClick={() => shortcutDialogRef.current?.open()}/>
                    <BarItem title={"Calcium "+ version} onClick={() => aboutDialogRef.current?.open()}/>
                </div>
            </footer>

            {/* Dialogs */}
            <AboutDialog ref={aboutDialogRef}/>
            <ShortcutDialog ref={shortcutDialogRef}/>
        </>
    );
}

export default StatusBar;
