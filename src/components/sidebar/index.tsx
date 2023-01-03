import React from "react";

import ModeButton from "./ModeButton";
import { Mode } from "../../types";

import GeneralIcon from "../../icons/general_mode.svg";
import GraphingIcon from "../../icons/graphing_mode.svg";
import ProgrammingIcon from "../../icons/programming_mode.svg";

const Sidebar: React.FC = () => {
    return (
        <aside className="sidebar-container">
            <div className="mode-switcher">
                <ModeButton modeName="General" mode={Mode.GENERAL} icon={GeneralIcon}/>
                <ModeButton modeName="Graphing" mode={Mode.GRAPHING} icon={GraphingIcon}/>
                <ModeButton modeName="Programming" mode={Mode.PROGRAMMING} icon={ProgrammingIcon}/>
            </div>
            <div className="history">
                <div className="history-header">
                    <h1>History</h1>
                </div>
                <div className="history-main">

                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
