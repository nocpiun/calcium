import React, { memo } from "react";

import KeypadTab from "./KeypadTab";
import KeypadSection from "./KeypadSection";

import InputButton from "./InputButton";

const MobileProgrammingInput: React.FC = memo(() => {
    return (
        <div className="mobile-input-container">
            <div className="tabs-container">
                <KeypadTab name="常用" id="common" default={true}/>
                <KeypadTab name="逻辑" id="logical"/>
            </div>
            <div className="keypad">
                <KeypadSection id="common" default={true}>
                    <div className="keypad-row">
                        <InputButton symbol="\ll" inputValue="\text{Lsh}" grow={2}/>
                        <InputButton symbol="\gg" inputValue="\text{Rsh}" grow={2}/>
                    </div>
                    <div className="keypad-row">
                        <InputButton symbol="\text{A}" grow={1} group={["hex"]}/>
                        <InputButton symbol="\text{B}" grow={1} group={["hex"]}/>
                        <InputButton symbol="\text{C}" grow={1} group={["hex"]}/>
                        <InputButton symbol="\text{D}" grow={1} group={["hex"]}/>
                        <InputButton symbol="\text{E}" grow={1} group={["hex"]}/>
                        <InputButton symbol="\text{F}" grow={1} group={["hex"]}/>
                    </div>
                    <div className="keypad-row">
                        <InputButton symbol="\text{Clear}" grow={1}/>
                        <InputButton symbol="\text{Del}" grow={1}/>
                        <InputButton symbol="\%" grow={1}/>
                        <InputButton symbol="/" grow={1}/>
                    </div>
                    <div className="keypad-row">
                        <InputButton symbol="1" grow={1} group={["hex", "dec", "oct", "bin"]}/>
                        <InputButton symbol="2" grow={1} group={["hex", "dec", "oct"]}/>
                        <InputButton symbol="3" grow={1} group={["hex", "dec", "oct"]}/>
                        <InputButton symbol="×" grow={1} group={["hex", "dec", "oct"]}/>
                    </div>
                    <div className="keypad-row">
                        <InputButton symbol="4" grow={1} group={["hex", "dec", "oct"]}/>
                        <InputButton symbol="5" grow={1} group={["hex", "dec", "oct"]}/>
                        <InputButton symbol="6" grow={1} group={["hex", "dec", "oct"]}/>
                        <InputButton symbol="+" grow={1}/>
                    </div>
                    <div className="keypad-row">
                        <InputButton symbol="7" grow={1} group={["hex", "dec", "oct"]}/>
                        <InputButton symbol="8" grow={1} group={["hex", "dec"]}/>
                        <InputButton symbol="9" grow={1} group={["hex", "dec"]}/>
                        <InputButton symbol="-" grow={1}/>
                    </div>
                    <div className="keypad-row">
                        <InputButton symbol="0" grow={1} group={["hex", "dec", "oct", "bin"]}/>
                        <InputButton symbol="\text{Result}" grow={3}/>
                    </div>
                </KeypadSection>
                <KeypadSection id="logical">
                    <div className="keypad-row">
                        <InputButton symbol="\text{AND}" grow={1}/>
                        <InputButton symbol="\text{OR}" grow={1}/>
                        <InputButton symbol="\text{NOT}" inputValue="\text{not}(" grow={1}/>
                    </div>
                    <div className="keypad-row">
                        <InputButton symbol="\text{NAND}" grow={1}/>
                        <InputButton symbol="\text{NOR}" grow={1}/>
                        <InputButton symbol="\text{XOR}" grow={1}/>
                    </div>
                </KeypadSection>
            </div>
        </div>
    );
})

export default MobileProgrammingInput;
