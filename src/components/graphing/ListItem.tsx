import React from "react";
import { InlineMath } from "react-katex";
import { ReactSVG } from "react-svg";

import Emitter from "../../utils/Emitter";

import removeIcon from "../../icons/remove.svg";

interface ListItemProps {
    id: number
    value: string
    index: number
}

const ListItem: React.FC<ListItemProps> = (props) => {
    const handleRemove = () => {
        Emitter.get().emit("remove-function", props.id, props.index);
    };

    return (
        <div className="function-list-item" id={"rendered-function--"+ props.id}>
            <div className="function-list-item-tag">
                <span><InlineMath>{"y_{"+ (props.index + 1).toString() +"} ="}</InlineMath></span>
            </div>
            <div className="function-list-item-value">
                <span><InlineMath>{props.value}</InlineMath></span>
            </div>
            <div className="function-list-item-remove" onClick={() => handleRemove()}>
                <ReactSVG src={removeIcon}/>
            </div>
        </div>
    );
}

export default ListItem;
