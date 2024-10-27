/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from "react";
import KeepAlive from "react-activation";

import ModeButton from "@/components/navbar/ModeButton";
import History from "@/components/sidebar/History";
import FunctionList from "@/components/sidebar/FunctionList";
import Sash from "@/components/Sash";

import { Mode } from "@/types";
import { version } from "@/global";
import Utils from "@/utils/Utils";
import Storage from "@/utils/Storage";
import Emitter from "@/utils/Emitter";

import useThemeDetector from "@/hooks/useThemeDetector";

import MainContext from "@/contexts/MainContext";

const Sidebar: React.FC = () => {
    const { mode } = useContext(MainContext);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(!Utils.isMobile());
    const [width, setWidth] = useState<number>(362);
    const themeValue = new Storage().getItem("ca-theme", useThemeDetector());

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
        new Emitter().emit("sidebar-state-change");
    };

    useEffect(() => {
        document.body.setAttribute("theme", themeValue);

        new Emitter().once("sidebar-state-change", () => {
            setSidebarOpen(!sidebarOpen);
        });
    }, [sidebarOpen]);

    return (
        <aside className={"sidebar-container"+ (sidebarOpen ? " open" : "")} style={!Utils.isMobile() ? { minWidth: width, maxWidth: width } : {}}>
            {/* Mobile only */}
            {<div className="mobile-control-panel">
                <div className="sidebar-title">
                    <span>Calcium {version}</span>
                </div>

                <div className="mode-switcher-wrapper">
                    <div className="mode-switcher">
                        <ModeButton name="通用" mode={Mode.GENERAL}/>
                        <ModeButton name="图像" mode={Mode.GRAPHING}/>
                        <ModeButton name="程序员" mode={Mode.PROGRAMMING}/>
                    </div>
                </div>
                
                <div className="links">
                    <span onClick={() => window.open("https://github.com/nocpiun/calcium/issues/new/choose")}>反馈问题</span>
                    <span onClick={() => new Emitter().emit("open-about-dialog")}>关于</span>
                    <span onClick={() => window.open("https://nocp.space/donate")}>支持我</span>
                </div>

                <div className="sidebar-backdrop" onClick={() => handleCloseSidebar()}/>
            </div>}
            
            {layoutSwitch(mode)}

            <Sash
                direction="vertical"
                defaultValue={width}
                minValue={342}
                maxValue={620}
                side="left"
                disabled={mode === Mode.GRAPHING}
                onChange={(value) => setWidth(value)}/>
        </aside>
    );
}

export default Sidebar;
