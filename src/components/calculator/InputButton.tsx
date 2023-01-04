/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { InlineMath } from "react-katex";

import Utils from "../../utils/Utils";
import { InputButtonProps, NumberType } from "../../types";
import Emitter from "../../utils/Emitter";

const InputButton: React.FC<InputButtonProps> = (props) => {
    const [disabled, setDisabled] = useState<boolean>(props.disabled ?? false);

    const clickHandle = () => {
        Emitter.get().emit("input", props.symbol);
    };

    useEffect(() => {
        if(!props.group) return;

        Emitter.get().on("number-type-chose", (type: NumberType) => {
            if(!props.group) return;

            setDisabled(!props.group.includes(Utils.numberTypeToStr(type)));
        });

        // default
        Emitter.get().emit("number-type-chose", NumberType.DEC);
    }, []);

    return (
        <div className="keypad-button-container" style={{ flexGrow: props.grow }}>
            <button className="keypad-button" onClick={() => clickHandle()} disabled={disabled}>
                <span>
                    <InlineMath>{props.symbol}</InlineMath>
                </span>
            </button>
        </div>
    );
}

export default InputButton;
