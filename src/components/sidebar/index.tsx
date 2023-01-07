import React from "react";

import ModeButton from "./ModeButton";
import History from "./History";
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
            
            <History />
        </aside>
    );
}

export default Sidebar;
