import React, { memo } from "react";
import { useContextMenu, ContextMenuItem, ContextMenuDivider } from "use-context-menu";

import InputButton from "../InputButton";

import Emitter from "../../utils/Emitter";

const ProgrammingInput: React.FC = memo(() => {
    const { contextMenu, onContextMenu } = useContextMenu(
        <>
            <ContextMenuItem onSelect={() => Emitter.get().emit("do-input", "\\text{Result}")}>计算结果...</ContextMenuItem>
            <ContextMenuItem onSelect={() => Emitter.get().emit("clear-input")}>清空</ContextMenuItem>
            <ContextMenuItem onSelect={() => Emitter.get().emit("clear-record")}>清空历史</ContextMenuItem>
            <ContextMenuDivider />
            <ContextMenuItem onSelect={() => Emitter.get().emit("open-funcs-dialog")}>函数...</ContextMenuItem>
        </>
    );

    return (
        <>
            <div
                className="input-container"
                onContextMenu={onContextMenu}>
                <div className="keypad">
                    <div className="keypad-row">
                        <div style={{ flexGrow: 5 }}/>
                        <div className="keypad-placeholder"/>
                        <div style={{ flexGrow: 4 }}/>
                        <div className="keypad-placeholder"/>
                        <div style={{ flexGrow: 5 }}/>
                        <div className="keypad-placeholder"/>
                        <div style={{ flexGrow: 5 }}/>
                    </div>
                    <div className="keypad-row">
                        <div style={{ flexGrow: 5 }}/>
                        <div className="keypad-placeholder"/>
                        <div style={{ flexGrow: 4 }}/>
                        <div className="keypad-placeholder"/>
                        <div style={{ flexGrow: 5 }}/>
                        <div className="keypad-placeholder"/>
                        <div style={{ flexGrow: 5 }}/>
                    </div>
                    <div className="keypad-row">
                        <div style={{ flexGrow: 5 }}/>
                        <div className="keypad-placeholder"/>
                        <div style={{ flexGrow: 4 }}/>
                        <div className="keypad-placeholder"/>
                        <div style={{ flexGrow: 5 }}/>
                        <div className="keypad-placeholder"/>
                        <div style={{ flexGrow: 5 }}/>
                    </div>
                    <div className="keypad-row">
                        <div style={{ flexGrow: 5 }}/>
                        <div className="keypad-placeholder"/>
                        <div style={{ flexGrow: 4 }}/>
                        <div className="keypad-placeholder"/>
                        <div style={{ flexGrow: 5 }}/>
                        <div className="keypad-placeholder"/>
                        <div style={{ flexGrow: 5 }}/>
                    </div>
                    <div className="keypad-row">
                        <div style={{ flexGrow: 5 }}/>
                        <div className="keypad-placeholder"/>
                        <div style={{ flexGrow: 4 }}/>
                        <div className="keypad-placeholder"/>
                        <div style={{ flexGrow: 5 }}/>
                        <div className="keypad-placeholder"/>
                        <div style={{ flexGrow: 5 }}/>
                    </div>
                    <div className="keypad-row">
                        <div style={{ flexGrow: 2 }}/>
                        <InputButton symbol="\text{AND}" grow={1} title="与"/>
                        <InputButton symbol="\text{OR}" grow={1} title="或"/>
                        <InputButton symbol="\text{A}" grow={1} group={["hex"]}/>
                        <div className="keypad-placeholder"/>
                        <InputButton symbol="\ll" inputValue="\text{Lsh}" grow={1} title="左移位"/>
                        <InputButton symbol="\gg" inputValue="\text{Rsh}" grow={1} title="右移位"/>
                        <InputButton symbol="\leftarrow" grow={1}/>
                        <InputButton symbol="\rightarrow" grow={1}/>
                        <div className="keypad-placeholder"/>
                        <div style={{ flexGrow: 5 }}/>
                        <div className="keypad-placeholder"/>
                        <div style={{ flexGrow: 5 }}/>
                    </div>
                    <div className="keypad-row">
                        <div style={{ flexGrow: 2 }}/>
                        <InputButton symbol="\text{NOT}" inputValue="\text{not}(" grow={1} title="非"/>
                        <InputButton symbol="\text{NAND}" grow={1} title="与非"/>
                        <InputButton symbol="\text{B}" grow={1} group={["hex"]}/>
                        <div className="keypad-placeholder"/>
                        <InputButton symbol="\%" inputValue="\%(" grow={1}/>
                        <InputButton symbol="\text{Clear}" grow={1} title="清空输入框"/>
                        <InputButton symbol="\text{Del}" grow={1} title="退格"/>
                        <InputButton symbol="/" grow={1}/>
                        <div className="keypad-placeholder"/>
                        <div style={{ flexGrow: 5 }}/>
                        <div className="keypad-placeholder"/>
                        <div style={{ flexGrow: 5 }}/>
                    </div>
                    <div className="keypad-row">
                        <div style={{ flexGrow: 2 }}/>
                        <InputButton symbol="\text{NOR}" grow={1} title="或非"/>
                        <InputButton symbol="\text{XOR}" grow={1} title="异或"/>
                        <InputButton symbol="\text{C}" grow={1} group={["hex"]}/>
                        <div className="keypad-placeholder"/>
                        <InputButton symbol="1" grow={1} group={["hex", "dec", "oct", "bin"]}/>
                        <InputButton symbol="2" grow={1} group={["hex", "dec", "oct"]}/>
                        <InputButton symbol="3" grow={1} group={["hex", "dec", "oct"]}/>
                        <InputButton symbol="×" grow={1}/>
                        <div className="keypad-placeholder"/>
                        <div style={{ flexGrow: 5 }}/>
                        <div className="keypad-placeholder"/>
                        <div style={{ flexGrow: 5 }}/>
                    </div>
                    <div className="keypad-row">
                        <div style={{ flexGrow: 2 }}/>
                        <InputButton symbol="(" grow={1}/>
                        <InputButton symbol=")" grow={1}/>
                        <InputButton symbol="\text{D}" grow={1} group={["hex"]}/>
                        <div className="keypad-placeholder"/>
                        <InputButton symbol="4" grow={1} group={["hex", "dec", "oct"]}/>
                        <InputButton symbol="5" grow={1} group={["hex", "dec", "oct"]}/>
                        <InputButton symbol="6" grow={1} group={["hex", "dec", "oct"]}/>
                        <InputButton symbol="-" grow={1}/>
                        <div className="keypad-placeholder"/>
                        <div style={{ flexGrow: 5 }}/>
                        <div className="keypad-placeholder"/>
                        <div style={{ flexGrow: 5 }}/>
                    </div>
                    <div className="keypad-row">
                        <div style={{ flexGrow: 2 }}/>
                        <InputButton symbol="[" grow={1} disabled/>
                        <InputButton symbol="]" grow={1} disabled/>
                        <InputButton symbol="\text{E}" grow={1} group={["hex"]}/>
                        <div className="keypad-placeholder"/>
                        <InputButton symbol="7" grow={1} group={["hex", "dec", "oct"]}/>
                        <InputButton symbol="8" grow={1} group={["hex", "dec"]}/>
                        <InputButton symbol="9" grow={1} group={["hex", "dec"]}/>
                        <InputButton symbol="+" grow={1}/>
                        <div className="keypad-placeholder"/>
                        <div style={{ flexGrow: 5 }}/>
                        <div className="keypad-placeholder"/>
                        <InputButton symbol="\leftarrow" grow={1} title="向前移动光标"/>
                        <InputButton symbol="\rightarrow" grow={1} title="向后移动光标"/>
                        <div style={{ flexGrow: 3 }}/>
                    </div>
                    <div className="keypad-row">
                        <div style={{ flexGrow: 2 }}/>
                        <InputButton symbol="\{" grow={1} disabled/>
                        <InputButton symbol="\}" grow={1} disabled/>
                        <InputButton symbol="\text{F}" grow={1} group={["hex"]}/>
                        <div className="keypad-placeholder"/>
                        <InputButton symbol="0" grow={1} group={["hex", "dec", "oct", "bin"]}/>
                        <InputButton symbol="\text{Result}" grow={3}/>
                        <div className="keypad-placeholder"/>
                        <div style={{ flexGrow: 5 }}/>
                        <div className="keypad-placeholder"/>
                        <InputButton symbol="\text{Result}" grow={2}/>
                        <InputButton symbol="\text{Clear}" grow={1} title="清空输入框"/>
                        <InputButton symbol="\text{Del}" grow={1} title="退格"/>
                        <InputButton symbol="\text{CH}" grow={1} title="清空历史记录"/>
                    </div>
                </div>
            </div>
            {contextMenu}
        </>
    );
})

export default ProgrammingInput;
