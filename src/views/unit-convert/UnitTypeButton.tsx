import React, { useState, useEffect } from "react";
import { ReactSVG } from "react-svg";

import useEmitter from "@/hooks/useEmitter";

import Emitter from "@/utils/Emitter";

interface UnitTypeButtonProps {
    name: string
    id: string
    default?: boolean;
}

const UnitTypeButton: React.FC<UnitTypeButtonProps> = (props) => {
    const id = props.id;
    const [icon, setIcon] = useState<string>("");
    const [selected, setSelected] = useState<boolean>(props.default ?? false);

    const handleSelect = () => {
        Emitter.get().emit("converting-type-select", id);
    };

    // import icon
    useEffect(() => {
        import("@/icons/"+ props.id +".svg").then((value) => setIcon(value.default));
    }, [props.id]);

    useEmitter([
        ["converting-type-select", (typeId: string) => {
            setSelected(id === typeId);
        }]
    ]);

    return (
        <button className={"unit-type-button"+ (selected ? " active" : "")} id={id} onClick={() => handleSelect()}>
            <ReactSVG src={icon}/>
            <span>{props.name}</span>
        </button>
    );
}

export default UnitTypeButton;
