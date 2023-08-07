import React from "react";
import { InlineMath } from "react-katex";

import { HistoryItemInfo } from "./History";

import Emitter from "../../utils/Emitter";

const HistoryItem: React.FC<HistoryItemInfo> = (props) => {
    const handleClick = () => {
        Emitter.get().emit("history-item-click", props);
    };

    return (
        <div className="history-item" onClick={() => handleClick()}>
            <div className="item-input">
                <span><InlineMath>{props.input}</InlineMath></span>
            </div>
            <div className="item-output">
                <span>
                    <InlineMath>{"= "+ props.output}</InlineMath>
                    <div className={"item-number-sys sys-"+ props.numberSys}>{props.numberSys}</div>
                </span>
            </div>
        </div>
    );
}

export default HistoryItem;
