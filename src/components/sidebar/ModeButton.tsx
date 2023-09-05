/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from "react";

import { Mode } from "@/types";
import Utils from "@/utils/Utils";
import Emitter from "@/utils/Emitter";

import MainContext from "@/contexts/MainContext";

interface ModeButtonProps {
    modeName: string
    mode: Mode
    icon: string
}

const ModeButton: React.FC<ModeButtonProps> = (props) => {
    const { setMode } = useContext(MainContext);
    const [isActive, setIsActive] = useState<boolean>(false);

    const handleClick = () => {
        Emitter.get().emit("switch-mode", props.mode);
    };

    useEffect(() => {
        // default
        Emitter.get().emit("switch-mode", Mode.GENERAL);

        Emitter.get().on("switch-mode", (newMode: Mode) => {
            setMode(newMode);
            setIsActive(newMode === props.mode);

            if(newMode === props.mode) {
                document.title = "Calcium - "+ props.modeName;
            }
        });
    }, []);

    return (
        <div className="mode-button-container">
            {
                !Utils.isMobile()
                ? (
                    <>
                        <div className={"highlight-bar"+ (isActive ? " active" : "")}/>
            
                        <button
                            className={"mode-button"+ (isActive ? " active" : "")}
                            title={props.modeName}
                            onClick={() => handleClick()}
                            style={{
                                maskImage: "url("+ props.icon +")",
                                WebkitMaskImage: "url("+ props.icon +")"
                            }}/>
                    </>
                )
                : (
                    <div
                        className={"mobile-mode-button"+ (isActive ? " active" : "")}
                        onClick={() => handleClick()}>
                        <div className="mobile-mode-button-bar"/>
                        <div className="mobile-mode-button-name">
                            <span>{props.modeName}</span>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

export default ModeButton;
