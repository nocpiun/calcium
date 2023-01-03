import React, { useState, useEffect } from "react";

import { ModeButtonProps, Mode } from "../../types";
import Emitter from "../../utils/Emitter";

const ModeButton: React.FC<ModeButtonProps> = (props) => {
    const [isActive, setIsActive] = useState<boolean>(false);

    const handleClick = () => {
        Emitter.get().emit("switch-mode", props.mode);
    };

    useEffect(() => {
        Emitter.get().on("switch-mode", (newMode: Mode) => {
            setIsActive(newMode === props.mode);
        });
    });

    useEffect(() => {
        // default
        Emitter.get().emit("switch-mode", Mode.GENERAL);
    }, []);

    return (
        <button
            className={"mode-button"+ (isActive ? " active" : "")}
            onClick={() => handleClick()}
            style={{
                maskImage: "url("+ props.icon +")",
                WebkitMaskImage: "url("+ props.icon +")"
            }}></button>
    );
}

export default ModeButton;
