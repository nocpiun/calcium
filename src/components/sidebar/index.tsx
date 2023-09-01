/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from "react";
import KeepAlive from "react-activation";

import ModeButton from "./ModeButton";
import Toggle from "../Toggle";
import History from "./History";
import FunctionList from "./FunctionList";

import { Mode } from "../../types";
import Utils from "../../utils/Utils";
import Storage from "../../utils/Storage";
import Emitter from "../../utils/Emitter";

import MainContext from "../../contexts/MainContext";

import GeneralIcon from "../../icons/general_mode.svg";
import GraphingIcon from "../../icons/graphing_mode.svg";
import ProgrammingIcon from "../../icons/programming_mode.svg";

const Sidebar: React.FC = () => {
    const { mode } = useContext(MainContext);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(!Utils.isMobile());
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

    const handleCloseSidebar = () => {
        Emitter.get().emit("sidebar-state-change");
    };

    useEffect(() => {
        document.body.setAttribute("theme", themeValue);

        Emitter.get().once("sidebar-state-change", () => {
            setSidebarOpen(!sidebarOpen);
        });
    }, [sidebarOpen]);

    return (
        <aside className={"sidebar-container"+ (sidebarOpen ? " open" : "")}>
            <div className="control-panel-container">
                {/* Mobile only */}
                {Utils.isMobile() && (
                    <div className="mobile-sidebar-title">
                        <span>Calcium</span>
                    </div>
                )}

                <div className="mode-switcher">
                    <ModeButton modeName="通用" mode={Mode.GENERAL} icon={GeneralIcon}/>
                    <ModeButton modeName="图像" mode={Mode.GRAPHING} icon={GraphingIcon}/>
                    <ModeButton modeName="程序员" mode={Mode.PROGRAMMING} icon={ProgrammingIcon}/>
                </div>
                
                {/* Mobile only */}
                {Utils.isMobile() && (
                    <div className="mobile-feedback-button">
                        <span onClick={() => window.open("https://github.com/nocpiun/calcium/issues/new/choose")}>反馈问题</span>
                    </div>
                )}

                <div className="theme-switcher">
                    <Toggle tooltip="浅色 / 深色主题" onChange={(e) => handleToggle(e)} defaultValue={themeValue === "light"}/>
                </div>

                {/* Mobile only */}
                {Utils.isMobile() && <div className="mobile-sidebar-backdrop" onClick={() => handleCloseSidebar()}/>}
            </div>
            
            {layoutSwitch(mode)}
        </aside>
    );
}

export default Sidebar;
