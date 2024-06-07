/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useId } from "react";

import { Mode } from "@/types";
import Utils from "@/utils/Utils";
import Emitter from "@/utils/Emitter";
import Storage from "@/utils/Storage";

import useEmitter from "@/hooks/useEmitter";

import MainContext from "@/contexts/MainContext";

interface ModeButtonProps {
    name: string
    mode: Mode
    icon?: string
}

const ModeButton: React.FC<ModeButtonProps> = (props) => {
    const { setMode } = useContext(MainContext);
    const [isActive, setIsActive] = useState<boolean>(false);
    const id = useId();

    const handleClick = () => {
        new Emitter().emit("switch-mode", props.mode);
    };

    useEmitter([
        ["switch-mode", (newMode: Mode) => {
            setMode(newMode);
            setIsActive(newMode === props.mode);

            if(newMode === props.mode) {
                document.title = "Calcium - "+ props.name;
                new Storage().setItem("ca-mode", props.mode);
            }
        }]
    ]);

    return (
        <div className="mode-button-container">
            {
                !Utils.isMobile()
                ? (
                    <button
                        className={"mode-button"+ (isActive ? " active" : "")}
                        data-tooltip-id={id}
                        data-tooltip-content={props.name}
                        onClick={() => handleClick()}>
                        <div
                            className="icon-container"
                            style={{
                                maskImage: "url("+ props.icon +")",
                                WebkitMaskImage: "url("+ props.icon +")"
                            }}/>
                        <div className="name-container">
                            <span>{props.name}</span>
                        </div>
                    </button>
                )
                : (
                    <div
                        className={"mobile-mode-button"+ (isActive ? " active" : "")}
                        onClick={() => handleClick()}>
                        <div className="mobile-mode-button-bar"/>
                        <div className="mobile-mode-button-name">
                            <span>{props.name}</span>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

export default ModeButton;
