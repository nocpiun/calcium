/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";

import { NumberType } from "../../types";
import Emitter from "../../utils/Emitter";

interface NumberBoxProps {
    name: string
    number: number
    type: NumberType
}

const NumberBox: React.FC<NumberBoxProps> = (props) => {
    const [isActive, setIsActive] = useState<boolean>(false);

    const clickHandle = () => {
        Emitter.get().emit("number-type-chose", props.type);
    };

    useEffect(() => {
        Emitter.get().on("number-type-chose", (type: NumberType) => {
            setIsActive(type === props.type);
        });
    }, []);

    return (
        <li className={"number-box"+ (isActive ? " active" : "")} onClick={() => clickHandle()}>
            <span className="name">{props.name}</span>
            <span className="number">{props.number}</span>
        </li>
    );
}

export default NumberBox;
