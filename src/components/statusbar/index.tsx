import React, { useRef } from "react";

import BarItem from "./BarItem";
import Dialog from "../Dialog";
import AboutDialog from "../../dialogs/AboutDialog";
import ShortcutDialog from "../../dialogs/ShortcutDialog";

import Emitter from "../../utils/Emitter";
import { version } from "../../global";

const StatusBar: React.FC = () => {
    const aboutDialogRef = useRef<Dialog>(null);
    const shortcutDialogRef = useRef<Dialog>(null);

    return (
        <>
            <footer className="status-bar">
                <div className="split">
                    <BarItem title="Star" to="https://github.com/nocpiun/calcium" className="star-repo" tooltip="Star the Repo"/>
                </div>
                <div className="split">
                    <BarItem title="Reload" onClick={() => Emitter.get().emit("graphing-reload")} tooltip="Reload Graphing Worker"/>
                    <BarItem title="Shortcuts" onClick={() => shortcutDialogRef.current?.open()}/>
                    <BarItem title={"Calcium "+ version} onClick={() => aboutDialogRef.current?.open()}/>
                </div>
            </footer>

            <AboutDialog ref={aboutDialogRef}/>
            <ShortcutDialog ref={shortcutDialogRef}/>
        </>
    );
}

export default StatusBar;
