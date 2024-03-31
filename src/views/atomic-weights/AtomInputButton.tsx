import React, { useMemo } from "react";
import { elements } from "chemical-elements";

import InputButton from "@/components/InputButton";

import Emitter from "@/utils/Emitter";

interface AtomInputButtonProps {
    number: number
}

const AtomInputButton: React.FC<AtomInputButtonProps> = (props) => {
    const element = useMemo(() => elements[props.number - 1], [props.number]);

    const handleClick = () => {
        new Emitter().emit("atom-input", props.number);
    };

    return (
        <InputButton
            symbol={"\\text{"+ element.symbol +"}"}
            inputValue={element.symbol}
            grow={1}
            title={element.name}
            disabled={element.mass === null}
            onClick={() => handleClick()}/>
    );
}

export default AtomInputButton;
