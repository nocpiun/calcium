import React, { useState, useRef } from "react";
import { InlineMath } from "react-katex";
import { ReactSVG } from "react-svg";
import { useContextMenu, ContextMenuItem } from "use-context-menu";

import Emitter from "@/utils/Emitter";
import Dialog from "@/components/Dialog";
import FunctionEditorDialog from "@/dialogs/FunctionEditorDialog";

import moreIcon from "@/icons/more.svg";
import removeIcon from "@/icons/remove.svg";

interface ListItemProps {
    id: number
    value: string
    index: number
}

const FunctionListItem: React.FC<ListItemProps> = (props) => {
    const [isRemoving, setIsRemoving] = useState<boolean>(false); // For animation playing
    const functionEditorDialogRef = useRef<Dialog>(null);

    const handleOpenEditorDialog = () => {
        functionEditorDialogRef.current?.open();
    };
    
    const handleRemove = () => {
        setIsRemoving(true);
        setTimeout(() => {
            new Emitter().emit("remove-function", props.id, props.index);
            setIsRemoving(false);
        }, 200);
    };

    const handlePlay = () => {
        new Emitter().emit("play-function", props.index);
    };

    const { contextMenu, onContextMenu } = useContextMenu(
        <>
            <ContextMenuItem onSelect={() => handlePlay()}>播放</ContextMenuItem>
        </>
    );

    return (
        <>
            <div
                className={"function-list-item"+ (isRemoving ? " play-removing-animation" : "")}
                id={"rendered-function--"+ props.id}
                onContextMenu={onContextMenu}>
                <div className="function-list-item-tag">
                    <span><InlineMath>{"y_{"+ (props.index + 1).toString() +"} ="}</InlineMath></span>
                </div>
                <div className="function-list-item-value">
                    <span><InlineMath>{props.value}</InlineMath></span>
                </div>

                <div className="function-list-item-buttons">
                    <button onClick={() => handleOpenEditorDialog()}>
                        <ReactSVG src={moreIcon}/>
                    </button>
                    <button onClick={() => handleRemove()}>
                        <ReactSVG src={removeIcon}/>
                    </button>
                </div>
            </div>

            <FunctionEditorDialog ref={functionEditorDialogRef} index={props.index} id={props.id} value={props.value}/>

            {contextMenu}
        </>
    );
}

export default FunctionListItem;
