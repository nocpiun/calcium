import React from "react";
import { InlineMath } from "react-katex";
import { useContextMenu, ContextMenuItem, ContextMenuDivider } from "use-context-menu";

import { HistoryItemInfo } from "./History";

import Emitter from "../../utils/Emitter";

const HistoryItem: React.FC<HistoryItemInfo> = (props) => {
    const handleClick = () => {
        Emitter.get().emit("history-item-click", props);
    };

    const { contextMenu, onContextMenu, onKeyDown } = useContextMenu(
        <>
            <ContextMenuItem onSelect={() => Emitter.get().emit("remove-record", props.id)}>删除</ContextMenuItem>
            <ContextMenuItem onSelect={() => handleClick()}>打开</ContextMenuItem>
            <ContextMenuDivider />
            <ContextMenuItem onSelect={() => Emitter.get().emit("clear-record")}>清空历史</ContextMenuItem>
        </>
    );

    return (
        <>
            <div
                className="history-item"
                id={"history-item--"+ props.id}
                onClick={() => handleClick()}
                onContextMenu={onContextMenu}
                onKeyDown={onKeyDown}>
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
            {contextMenu}
        </>
    );
}

export default HistoryItem;
