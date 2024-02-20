/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";

import Emitter from "@/utils/Emitter";

interface KeypadTabProps {
    name: string
    id: string
    default?: boolean
}

const KeypadTab: React.FC<KeypadTabProps> = (props) => {
    const [open, setOpen] = useState<boolean>(props.default ?? false);

    const handleClick = () => {
        new Emitter().emit("open-keypad-tab", props.id);
    };

    useEffect(() => {
        new Emitter().on("open-keypad-tab", (targetId: string) => {
            setOpen(targetId === props.id);
        });
    }, []);

    return (
        <div className={"keypad-tab"+ (open ? " open" : "")} id={props.id} onClick={() => handleClick()}>
            <div className="keypad-tab-name">{props.name}</div>
        </div>
    );
}

export default KeypadTab;
