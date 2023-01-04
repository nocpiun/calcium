/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";

import { ModeButtonProps, Mode } from "../../types";
import Emitter from "../../utils/Emitter";

const ModeButton: React.FC<ModeButtonProps> = (props) => {
    const [isActive, setIsActive] = useState<boolean>(false);

    const handleClick = () => {
        Emitter.get().emit("switch-mode", props.mode);
    };

    useEffect(() => {
        // default
        Emitter.get().emit("switch-mode", Mode.GENERAL);

        Emitter.get().on("switch-mode", (newMode: Mode) => {
            setIsActive(newMode === props.mode);
        });
    }, []);

    return (
        <button
            className={"mode-button"+ (isActive ? " active" : "")}
            title={props.modeName}
            onClick={() => handleClick()}
            style={{
                maskImage: "url("+ props.icon +")",
                WebkitMaskImage: "url("+ props.icon +")"
            }}/>
    );
}

export default ModeButton;
