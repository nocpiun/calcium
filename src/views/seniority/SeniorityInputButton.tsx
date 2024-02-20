import React from "react";

import InputButton from "@/components/InputButton";

import Emitter from "@/utils/Emitter";

interface SeniorityInputButtonProps {
    name: string
    id: string
}

const SeniorityInputButton: React.FC<SeniorityInputButtonProps> = (props) => {
    const handleClick = () => {
        new Emitter().emit("seniority-input", props.name, props.id);
    };

    return (
        <InputButton
            symbol={props.name}
            grow={1}
            onClick={() => handleClick()}/>
    );
}

export default SeniorityInputButton;
