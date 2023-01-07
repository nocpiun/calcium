import React from "react";
import { InlineMath } from "react-katex";

import { HistoryItemProps } from "../../types";

const HistoryItem: React.FC<HistoryItemProps> = (props) => {
    return (
        <div className="history-item">
            <div className="item-input">
                <span><InlineMath>{props.input}</InlineMath></span>
            </div>
            <div className="item-output">
                <span><InlineMath>{"= "+ props.output}</InlineMath></span>
            </div>
        </div>
    );
}

export default HistoryItem;
