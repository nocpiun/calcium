import React, { useState, useEffect } from "react";
import { InlineMath } from "react-katex";

import Utils from "../../utils/Utils";
import { InputButtonProps, NumberType } from "../../types";
import Emitter from "../../utils/Emitter";

const InputButton: React.FC<InputButtonProps> = (props) => {
    const [disabled, setDisabled] = useState<boolean>(false);

    const clickHandle = () => {
        /** @todo */
    };

    useEffect(() => {
        Emitter.get().on("number-type-chose", (type: NumberType) => {
            if(!props.group) return;

            setDisabled(!props.group.includes(Utils.numberTypeToStr(type)));
        });
    });

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
