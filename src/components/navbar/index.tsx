import React, { useEffect, useRef } from "react";
import Toggle from "@nocp/toggle";

import ModeButton from "@/components/navbar/ModeButton";
import ToolbarItem from "@/components/navbar/ToolbarItem";
import Dialog from "@/components/Dialog";
import ConvertingDialog from "@/dialogs/ConvertingDialog";
import SeniorityDialog from "@/dialogs/SeniorityDialog";
import CurrencyDialog from "@/dialogs/CurrencyDialog";

import Emitter from "@/utils/Emitter";
import Storage from "@/utils/Storage";
import useThemeDetector from "@/hooks/useThemeDetector";
import { Mode, Theme } from "@/types";

import GeneralIcon from "@/icons/general_mode.svg";
import GraphingIcon from "@/icons/graphing_mode.svg";
import ProgrammingIcon from "@/icons/programming_mode.svg";

const Navbar: React.FC = () => {
    const convertingDialogRef = useRef<Dialog>(null);
    const seniorityDialogRef = useRef<Dialog>(null);
    const currencyDialogRef = useRef<Dialog>(null);
    const themeValue = new Storage().getItem("ca-theme", useThemeDetector());

    const handleToggle = (isActive: boolean) => {
        document.body.setAttribute("theme", isActive ? Theme.LIGHT : Theme.DARK);
        new Storage().setItem("ca-theme", isActive ? Theme.LIGHT : Theme.DARK);
    };

    useEffect(() => {
        // default
        new Emitter().emit("switch-mode", new Storage().getItem("ca-mode", Mode.GENERAL) as Mode);
    }, []);

    return (
        <>
            <nav className="navbar">
                <div className="split">
                    <div className="mode-switcher">
                        <ModeButton name="通用" mode={Mode.GENERAL} icon={GeneralIcon}/>
                        <ModeButton name="图像" mode={Mode.GRAPHING} icon={GraphingIcon}/>
                        <ModeButton name="程序员" mode={Mode.PROGRAMMING} icon={ProgrammingIcon}/>
                    </div>
                </div>

                <div className="split">
                    <div className="toolbar">
                        <ToolbarItem title="汇率" onClick={() => currencyDialogRef.current?.open()}/>
                        <ToolbarItem title="辈分计算" onClick={() => seniorityDialogRef.current?.open()}/>
                        <ToolbarItem title="单位换算" onClick={() => convertingDialogRef.current?.open()}/>
                    </div>

                    <div className="theme-switcher-container">
                        <div className="theme-switcher-name">
                            <span>浅色 / 深色主题</span>
                        </div>

                        <div className="theme-switcher">
                            <Toggle
                                data-tooltip-id="theme-switcher"
                                data-tooltip-content="浅色 / 深色主题"
                                onToggle={(e) => handleToggle(e)}
                                defaultToggleValue={themeValue === Theme.LIGHT}/>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Dialogs */}
            <ConvertingDialog ref={convertingDialogRef}/>
            <SeniorityDialog ref={seniorityDialogRef}/>
            <CurrencyDialog ref={currencyDialogRef}/>
        </>
    );
};

export default Navbar;
