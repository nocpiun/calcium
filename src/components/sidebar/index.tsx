/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useContext } from "react";
import KeepAlive from "react-activation";

import ModeButton from "./ModeButton";
import Toggle from "../Toggle";
import History from "./History";
import FunctionList from "./FunctionList";

import { Mode } from "../../types";
import Storage from "../../utils/Storage";

import MainContext from "../../contexts/MainContext";

import GeneralIcon from "../../icons/general_mode.svg";
import GraphingIcon from "../../icons/graphing_mode.svg";
import ProgrammingIcon from "../../icons/programming_mode.svg";

const Sidebar: React.FC = () => {
    const { mode } = useContext(MainContext);
    const themeValue = Storage.get().getItem("theme", "light");

    const handleToggle = (isActive: boolean) => {
        document.body.setAttribute("theme", isActive ? "light" : "dark");
        Storage.get().setItem("theme", isActive ? "light" : "dark");
    };

    const layoutSwitch = (calcMode: Mode) => {
        switch(calcMode) {
            case Mode.GENERAL:
            case Mode.PROGRAMMING:
                return (
                    <KeepAlive>
                        <History />
                    </KeepAlive>
                );
            case Mode.GRAPHING:
                return (
                    <KeepAlive when={false}>
                        <FunctionList />
                    </KeepAlive>
                );
        }
    };

    useEffect(() => {
        document.body.setAttribute("theme", themeValue);
    }, []);

    return (
        <aside className="sidebar-container">
            <div className="control-panel-container">
                <div className="mode-switcher">
                    <ModeButton modeName="通用" mode={Mode.GENERAL} icon={GeneralIcon}/>
                    <ModeButton modeName="图像" mode={Mode.GRAPHING} icon={GraphingIcon}/>
                    <ModeButton modeName="程序员" mode={Mode.PROGRAMMING} icon={ProgrammingIcon}/>
                </div>
                <div className="theme-switcher">
                    <Toggle tooltip="浅色 / 深色主题" onChange={(e) => handleToggle(e)} defaultValue={themeValue === "light"}/>
                </div>
            </div>
            
            {layoutSwitch(mode)}
        </aside>
    );
}

export default Sidebar;
