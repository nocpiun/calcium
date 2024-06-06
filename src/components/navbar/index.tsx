import React from "react";
import { Tooltip } from "react-tooltip";
import Toggle from "@nocp/toggle";

import ModeButton from "@/components/navbar/ModeButton";

import Storage from "@/utils/Storage";
import useThemeDetector from "@/hooks/useThemeDetector";
import { Mode, Theme } from "@/types";

import GeneralIcon from "@/icons/general_mode.svg";
import GraphingIcon from "@/icons/graphing_mode.svg";
import ProgrammingIcon from "@/icons/programming_mode.svg";

const Navbar: React.FC = () => {
    const themeValue = new Storage().getItem("theme", useThemeDetector());

    const handleToggle = (isActive: boolean) => {
        document.body.setAttribute("theme", isActive ? Theme.LIGHT : Theme.DARK);
        new Storage().setItem("theme", isActive ? Theme.LIGHT : Theme.DARK);
    };

    return (
        <nav className="navbar">
            <div className="mode-switcher">
                <ModeButton name="通用" mode={Mode.GENERAL} icon={GeneralIcon}/>
                <ModeButton name="图像" mode={Mode.GRAPHING} icon={GraphingIcon}/>
                <ModeButton name="程序员" mode={Mode.PROGRAMMING} icon={ProgrammingIcon}/>
            </div>

            <div className="theme-switcher">
                <Toggle
                    data-tooltip-id="theme-switcher"
                    data-tooltip-content="浅色 / 深色主题"
                    onToggle={(e) => handleToggle(e)}
                    defaultToggleValue={themeValue === Theme.LIGHT}/>

                <Tooltip
                    id="theme-switcher"
                    place="right"
                    opacity={1}
                    border="1px solid var(--ca-gray2)"
                    delayShow={500}/>
            </div>
        </nav>
    );
};

export default Navbar;
