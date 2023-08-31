/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";

import Emitter from "../utils/Emitter";
import { PropsWithChildren } from "../types";

interface KeypadPageProps extends PropsWithChildren {
    id: string
    default?: boolean
}

const KeypadSection: React.FC<KeypadPageProps> = (props) => {
    const [open, setOpen] = useState<boolean>(props.default ?? false);

    useEffect(() => {
        Emitter.get().on("open-keypad-tab", (targetId: string) => {
            setOpen(targetId === props.id);
        });
    }, []);

    return <section className={"keypad-section"+ (open ? " open" : "")} id={props.id}>{props.children}</section>;
}

export default KeypadSection;
