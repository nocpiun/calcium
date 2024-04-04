import React, { useMemo } from "react";
import { elements } from "chemical-elements";

import InputButton from "@/components/InputButton";
import { getAtomicWeight } from "@/views/atomic-weights/AtomicWeightsPage";

import Emitter from "@/utils/Emitter";

interface AtomInputButtonProps {
    number: number
}

const AtomInputButton: React.FC<AtomInputButtonProps> = (props) => {
    const element = useMemo(() => elements[props.number - 1], [props.number]);
    const mass = useMemo(() => getAtomicWeight(props.number), [props.number]);

    const handleClick = () => {
        new Emitter().emit("atom-input", props.number);
    };

    return (
        <InputButton
            symbol={(element.mass ? "^{"+ mass +"}" : "") +"_{"+ element.number +"}\\text{"+ element.symbol +"}"}
            inputValue={element.symbol}
            grow={1}
            title={element.name}
            disabled={element.mass === null}
            onClick={() => handleClick()}/>
    );
}

export default AtomInputButton;
