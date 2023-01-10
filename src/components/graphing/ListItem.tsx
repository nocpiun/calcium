import React from "react";
import { InlineMath } from "react-katex";

interface ListItemProps {
    value: string
    index: number
}

const ListItem: React.FC<ListItemProps> = (props) => {
    return (
        <div className="function-list-item">
            <div className="function-list-item-tag">
                <span><InlineMath>{"y_{"+ (props.index + 1).toString() +"} ="}</InlineMath></span>
            </div>
            <div className="function-list-item-value">
                <span><InlineMath>{props.value}</InlineMath></span>
            </div>
        </div>
    );
}

export default ListItem;
