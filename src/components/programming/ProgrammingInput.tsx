import React from "react";

import InputButton from "../InputButton";

const ProgrammingInput: React.FC = () => {
    return (
        <div className="input-container">
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
                    <InputButton symbol="\text{AND}" grow={1}/>
                    <InputButton symbol="\text{OR}" grow={1}/>
                    <InputButton symbol="\text{A}" grow={1} group={["hex"]}/>
                    <div className="keypad-placeholder"/>
                    <InputButton symbol="\ll" inputValue="\text{Lsh}" grow={1} title="Left Shift"/>
                    <InputButton symbol="\gg" inputValue="\text{Rsh}" grow={1} title="Right Shift"/>
                    <InputButton symbol="\leftarrow" grow={1}/>
                    <InputButton symbol="\rightarrow" grow={1}/>
                    <div className="keypad-placeholder"/>
                    <div style={{ flexGrow: 5 }}/>
                    <div className="keypad-placeholder"/>
                    <div style={{ flexGrow: 5 }}/>
                </div>
                <div className="keypad-row">
                    <div style={{ flexGrow: 2 }}/>
                    <InputButton symbol="\text{NOT}" inputValue="\text{not}(" grow={1}/>
                    <InputButton symbol="\text{NAND}" grow={1}/>
                    <InputButton symbol="\text{B}" grow={1} group={["hex"]}/>
                    <div className="keypad-placeholder"/>
                    <InputButton symbol="\%" inputValue="\%(" grow={1}/>
                    <InputButton symbol="\text{Clear}" grow={1} title="Clear Input"/>
                    <InputButton symbol="\text{Del}" grow={1} title="Delete a Symbol"/>
                    <InputButton symbol="/" grow={1}/>
                    <div className="keypad-placeholder"/>
                    <div style={{ flexGrow: 5 }}/>
                    <div className="keypad-placeholder"/>
                    <div style={{ flexGrow: 5 }}/>
                </div>
                <div className="keypad-row">
                    <div style={{ flexGrow: 2 }}/>
                    <InputButton symbol="\text{NOR}" grow={1}/>
                    <InputButton symbol="\text{XOR}" grow={1}/>
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
                    <InputButton symbol="\leftarrow" grow={1} title="Move Cursor Forward"/>
                    <InputButton symbol="\rightarrow" grow={1} title="Move Cursor Backward"/>
                    <InputButton symbol="\text{Clear}" grow={1} title="Clear Input"/>
                    <InputButton symbol="\text{Del}" grow={1} title="Delete a Symbol"/>
                    <InputButton symbol="\text{CH}" grow={1} disabled title="Clear History Records"/>
                </div>
                <div className="keypad-row">
                    <div style={{ flexGrow: 2 }}/>
                    <InputButton symbol="\{" grow={1} disabled/>
                    <InputButton symbol="\}" grow={1} disabled/>
                    <InputButton symbol="\text{F}" grow={1} group={["hex"]}/>
                    <div className="keypad-placeholder"/>
                    <InputButton symbol="0" grow={1} group={["hex", "dec", "oct", "bin"]}/>
                    <InputButton symbol="." grow={1} disabled/>
                    <InputButton symbol="\text{Result}" grow={2}/>
                    <div className="keypad-placeholder"/>
                    <div style={{ flexGrow: 5 }}/>
                    <div className="keypad-placeholder"/>
                    <InputButton symbol="\text{Result}" grow={1}/>
                    <InputButton symbol="\text{Vars}" grow={1} disabled title="Open Variable Dialog"/>
                    <InputButton symbol="\text{Funcs}" grow={1} title="Open Function Dialog"/>
                    <div style={{ flexGrow: 2 }}/>
                </div>
            </div>
        </div>
    );
}

export default ProgrammingInput;
