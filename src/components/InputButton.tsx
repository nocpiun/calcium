/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useId } from "react";
import { Tooltip } from "react-tooltip";
import { InlineMath } from "react-katex";

import { NumberSys } from "@/types";
import Emitter from "@/utils/Emitter";

interface InputButtonProps {
    symbol: string
    inputValue?: string
    grow: number
    group?: string[]
    disabled?: boolean
    title?: string
    style?: React.CSSProperties
    onClick?: () => void
}

const InputButton: React.FC<InputButtonProps> = (props) => {
    const [disabled, setDisabled] = useState<boolean>(props.disabled ?? false);
    const inputValue = props.inputValue ?? props.symbol;
    const id = useId();

    const clickHandle = () => {
        if(props.onClick) {
            props.onClick();
            return;
        }

        Emitter.get().emit("input", inputValue);
    };

    useEffect(() => {
        if(!props.group) return;

        Emitter.get().on("number-sys-chose", (type: NumberSys) => {
            if(!props.group) return;

            setDisabled(!props.group.includes(type));
        });

        // default
        Emitter.get().emit("number-sys-chose", NumberSys.DEC);
    }, []);

    return (
        <div className="keypad-button-container" style={{ flexGrow: props.grow }}>
            <button
                className="keypad-button"
                onClick={() => clickHandle()}
                disabled={disabled}
                style={props.style}
                tabIndex={-1}
                data-tooltip-id={id}
                data-tooltip-content={props.title}>
                <span>
                    <InlineMath>{props.symbol}</InlineMath>
                </span>
            </button>

            {
                props.title &&
                <Tooltip
                    id={id}
                    place="top"
                    opacity={1}
                    border="1px solid var(--ca-gray2)"/>
            }
        </div>
    );
}

export default InputButton;
