/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from "react";
import { Tooltip } from "react-tooltip";
import Toggle from "@nocp/toggle";
import KeepAlive from "react-activation";

import ModeButton from "@/components/sidebar/ModeButton";
import History from "@/components/sidebar/History";
import FunctionList from "@/components/sidebar/FunctionList";

import { Mode } from "@/types";
import { version } from "@/global";
import Utils from "@/utils/Utils";
import Storage from "@/utils/Storage";
import Emitter from "@/utils/Emitter";

import MainContext from "@/contexts/MainContext";

import GeneralIcon from "@/icons/general_mode.svg";
import GraphingIcon from "@/icons/graphing_mode.svg";
import ProgrammingIcon from "@/icons/programming_mode.svg";

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
                        <span>Calcium {version}</span>
                    </div>
                )}

                <div className="mode-switcher-wrapper">
                    <div className="mode-switcher-tab-slider" style={{ transform: "translateY("+ mode * 100 +"%)" }}/>
                    <div className="mode-switcher">
                        <ModeButton modeName="通用" mode={Mode.GENERAL} icon={GeneralIcon}/>
                        <ModeButton modeName="图像" mode={Mode.GRAPHING} icon={GraphingIcon}/>
                        <ModeButton modeName="程序员" mode={Mode.PROGRAMMING} icon={ProgrammingIcon}/>
                    </div>
                </div>
                
                {/* Mobile only */}
                {Utils.isMobile() && (
                    <div className="mobile-links">
                        <span onClick={() => window.open("https://github.com/nocpiun/calcium/issues/new/choose")}>反馈问题</span>
                        <span onClick={() => Emitter.get().emit("open-about-dialog")}>关于</span>
                        <span onClick={() => window.open("https://nin.red/#/donate")}>支持我</span>
                    </div>
                )}

                <div className="theme-switcher">
                    <Toggle
                        data-tooltip-id="theme-switcher"
                        data-tooltip-content="浅色 / 深色主题"
                        onToggle={(e) => handleToggle(e)}
                        defaultToggleValue={themeValue === "light"}/>

                    <Tooltip
                        id="theme-switcher"
                        place="right"
                        opacity={1}
                        border="1px solid var(--ca-gray2)"
                        delayShow={500}/>
                </div>

                {/* Mobile only */}
                {Utils.isMobile() && <div className="mobile-sidebar-backdrop" onClick={() => handleCloseSidebar()}/>}
            </div>
            
            {layoutSwitch(mode)}
        </aside>
    );
}

export default Sidebar;
