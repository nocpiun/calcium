/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { InlineMath } from "react-katex";

import { NumberType } from "../types";
import Emitter from "../utils/Emitter";

interface InputButtonProps {
    symbol: string
    inputValue?: string
    grow: number
    group?: string[]
    disabled?: boolean
    title?: string
    style?: React.CSSProperties
}

const InputButton: React.FC<InputButtonProps> = (props) => {
    const [disabled, setDisabled] = useState<boolean>(props.disabled ?? false);
    const inputValue = props.inputValue ?? props.symbol;

    const clickHandle = () => {
        Emitter.get().emit("input", inputValue);
    };

    useEffect(() => {
        if(!props.group) return;

        Emitter.get().on("number-type-chose", (type: NumberType) => {
            if(!props.group) return;

            setDisabled(!props.group.includes(type));
        });

        // default
        Emitter.get().emit("number-type-chose", NumberType.DEC);
    }, []);

    return (
        <div className="keypad-button-container" style={{ flexGrow: props.grow }}>
            <button
                className="keypad-button"
                onClick={() => clickHandle()}
                disabled={disabled}
                title={props.title}
                style={props.style}
                tabIndex={-1}>
                <span>
                    <InlineMath>{props.symbol}</InlineMath>
                </span>
            </button>
        </div>
    );
}

export default InputButton;
