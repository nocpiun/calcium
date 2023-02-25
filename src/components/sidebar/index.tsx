/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";

import ModeButton from "./ModeButton";
import Toggle from "../Toggle";
import History from "./History";
import { Mode } from "../../types";
import Storage from "../../utils/Storage";

import GeneralIcon from "../../icons/general_mode.svg";
import GraphingIcon from "../../icons/graphing_mode.svg";
import ProgrammingIcon from "../../icons/programming_mode.svg";

const Sidebar: React.FC = () => {
    const themeValue = Storage.get().getItem("theme", "dark");

    const handleToggle = (isActive: boolean) => {
        document.body.setAttribute("theme", isActive ? "light" : "dark");
        Storage.get().setItem("theme", isActive ? "light" : "dark");
    };

    useEffect(() => {
        document.body.setAttribute("theme", themeValue);
    }, []);

    return (
        <aside className="sidebar-container">
            <div className="control-panel-container">
                <div className="mode-switcher">
                    <ModeButton modeName="General" mode={Mode.GENERAL} icon={GeneralIcon}/>
                    <ModeButton modeName="Graphing" mode={Mode.GRAPHING} icon={GraphingIcon}/>
                    <ModeButton modeName="Programming" mode={Mode.PROGRAMMING} icon={ProgrammingIcon}/>
                </div>
                <div className="theme-switcher">
                    <Toggle tooltip="Dark / Light Mode" onChange={(e) => handleToggle(e)} defaultValue={themeValue === "light"}/>
                </div>
            </div>
            
            <History />
        </aside>
    );
}

export default Sidebar;
