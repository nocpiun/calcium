import React from "react";

import InputButton from "./InputButton";

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
                    <InputButton symbol="\ll" grow={2}/>
                    <InputButton symbol="\gg" grow={2}/>
                    <div className="keypad-placeholder"/>
                    <div style={{ flexGrow: 5 }}/>
                    <div className="keypad-placeholder"/>
                    <div style={{ flexGrow: 5 }}/>
                </div>
                <div className="keypad-row">
                    <div style={{ flexGrow: 2 }}/>
                    <InputButton symbol="\text{NOT}" grow={1}/>
                    <InputButton symbol="\text{NAND}" grow={1}/>
                    <InputButton symbol="\text{B}" grow={1} group={["hex"]}/>
                    <div className="keypad-placeholder"/>
                    <InputButton symbol="\%" grow={1}/>
                    <InputButton symbol="\text{Clear}" grow={1}/>
                    <InputButton symbol="\text{Del}" grow={1}/>
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
                    <InputButton symbol="[" grow={1}/>
                    <InputButton symbol="]" grow={1}/>
                    <InputButton symbol="\text{E}" grow={1} group={["hex"]}/>
                    <div className="keypad-placeholder"/>
                    <InputButton symbol="7" grow={1} group={["hex", "dec", "oct"]}/>
                    <InputButton symbol="8" grow={1} group={["hex", "dec"]}/>
                    <InputButton symbol="9" grow={1} group={["hex", "dec"]}/>
                    <InputButton symbol="+" grow={1}/>
                    <div className="keypad-placeholder"/>
                    <div style={{ flexGrow: 5 }}/>
                    <div className="keypad-placeholder"/>
                    <div style={{ flexGrow: 5 }}/>
                </div>
                <div className="keypad-row">
                    <div style={{ flexGrow: 2 }}/>
                    <InputButton symbol="\{" grow={1}/>
                    <InputButton symbol="\}" grow={1}/>
                    <InputButton symbol="\text{F}" grow={1} group={["hex"]}/>
                    <div className="keypad-placeholder"/>
                    <InputButton symbol="0" grow={1} group={["hex", "dec", "oct", "bin"]}/>
                    <InputButton symbol="." grow={1}/>
                    <InputButton symbol="=" grow={2}/>
                    <div className="keypad-placeholder"/>
                    <div style={{ flexGrow: 5 }}/>
                    <div className="keypad-placeholder"/>
                    <div style={{ flexGrow: 5 }}/>
                </div>
            </div>
        </div>
    );
}

export default ProgrammingInput;
