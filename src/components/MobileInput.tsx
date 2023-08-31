import React, { memo } from "react";

import KeypadTab from "./KeypadTab";
import KeypadSection from "./KeypadSection";

import InputButton from "./InputButton";

interface MobileInputProps {
    isGraphingMode?: boolean
}

const MobileInput: React.FC<MobileInputProps> = memo((props) => {
    return (
        <div className="mobile-input-container">
            <div className="tabs-container">
                <KeypadTab name="常用" id="common" default={true}/>
                <KeypadTab name="符号" id="symbols"/>
                <KeypadTab name="函数" id="functions"/>
                <KeypadTab name="高级" id="professional"/>
            </div>
            <div className="keypad">
                <KeypadSection id="common" default={true}>
                    <div className="keypad-row">
                        <InputButton symbol="\sin" inputValue="\sin(" grow={1}/>
                        <InputButton symbol="\cos" inputValue="\cos(" grow={1}/>
                        <InputButton symbol="\tan" inputValue="\tan(" grow={1}/>
                        <InputButton symbol="\cot" inputValue="\cot(" grow={1}/>
                    </div>
                    <div className="keypad-row">
                        <InputButton symbol="(" grow={1}/>
                        <InputButton symbol=")" grow={1}/>
                        <InputButton symbol="\sec" inputValue="\sec(" grow={1}/>
                        <InputButton symbol="\csc" inputValue="\csc(" grow={1}/>
                    </div>
                    <div className="keypad-row">
                        <InputButton symbol="a^2" grow={1}/>
                        <InputButton symbol="\sqrt{a}" grow={1}/>
                        <InputButton symbol="\pi" grow={1}/>
                        <InputButton symbol="e" grow={1}/>
                    </div>
                    <div className="keypad-row">
                        <InputButton symbol="\text{Clear}" grow={1}/>
                        <InputButton symbol="\text{Del}" grow={1}/>
                        <InputButton symbol="\%" grow={1}/>
                        <InputButton symbol="/" grow={1}/>
                    </div>
                    <div className="keypad-row">
                        <InputButton symbol="1" grow={1}/>
                        <InputButton symbol="2" grow={1}/>
                        <InputButton symbol="3" grow={1}/>
                        <InputButton symbol="×" grow={1}/>
                    </div>
                    <div className="keypad-row">
                        <InputButton symbol="4" grow={1}/>
                        <InputButton symbol="5" grow={1}/>
                        <InputButton symbol="6" grow={1}/>
                        <InputButton symbol="+" grow={1}/>
                    </div>
                    <div className="keypad-row">
                        <InputButton symbol="7" grow={1}/>
                        <InputButton symbol="8" grow={1}/>
                        <InputButton symbol="9" grow={1}/>
                        <InputButton symbol="-" grow={1}/>
                    </div>
                    <div className="keypad-row">
                        <InputButton symbol="0" grow={1}/>
                        <InputButton symbol="." grow={1}/>
                        {!props.isGraphingMode && <InputButton symbol="\text{Result}" grow={2}/>}
                    </div>
                </KeypadSection>
                <KeypadSection id="symbols">
                    <div className="keypad-row">
                        <InputButton symbol="a" grow={1}/>
                        <InputButton symbol="b" grow={1}/>
                        <InputButton symbol="c" grow={1}/>
                        <InputButton symbol="d" grow={1}/>
                        <InputButton symbol="e" grow={1}/>
                    </div>
                    <div className="keypad-row">
                        <InputButton symbol="f" grow={1}/>
                        <InputButton symbol="g" grow={1}/>
                        <InputButton symbol="h" grow={1}/>
                        <InputButton symbol="i" grow={1}/>
                        <InputButton symbol="j" grow={1}/>
                    </div>
                    <div className="keypad-row">
                        <InputButton symbol="k" grow={1}/>
                        <InputButton symbol="l" grow={1}/>
                        <InputButton symbol="m" grow={1}/>
                        <InputButton symbol="n" grow={1}/>
                        <InputButton symbol="o" grow={1}/>
                    </div>
                    <div className="keypad-row">
                        <InputButton symbol="p" grow={1}/>
                        <InputButton symbol="q" grow={1}/>
                        <InputButton symbol="r" grow={1}/>
                        <InputButton symbol="s" grow={1}/>
                        <InputButton symbol="t" grow={1}/>
                    </div>
                    <div className="keypad-row">
                        <InputButton symbol="u" grow={1}/>
                        <InputButton symbol="v" grow={1}/>
                        <InputButton symbol="w" grow={1}/>
                        <InputButton symbol="x" grow={1}/>
                        <InputButton symbol="y" grow={1}/>
                    </div>
                    <div className="keypad-row">
                        <InputButton symbol="z" grow={1}/>
                        <InputButton symbol="\alpha" grow={1}/>
                        <InputButton symbol="\beta" grow={1}/>
                        <InputButton symbol="\gamma" grow={1}/>
                        <InputButton symbol="\delta" grow={1}/>
                    </div>
                    <div className="keypad-row">
                        <InputButton symbol="\epsilon" grow={1}/>
                        <InputButton symbol="\zeta" grow={1}/>
                        <InputButton symbol="\eta" grow={1}/>
                        <InputButton symbol="\theta" grow={1}/>
                        <InputButton symbol="\iota" grow={1}/>
                    </div>
                    <div className="keypad-row">
                        <InputButton symbol="\kappa" grow={1}/>
                        <InputButton symbol="\lambda" grow={1}/>
                        <InputButton symbol="\mu" grow={1}/>
                        <InputButton symbol="\nu" grow={1}/>
                        <InputButton symbol="\xi" grow={1}/>
                    </div>
                    <div className="keypad-row">
                        <InputButton symbol="\omicron" grow={1}/>
                        <InputButton symbol="\pi" grow={1}/>
                        <InputButton symbol="\rho" grow={1}/>
                        <InputButton symbol="\sigma" grow={1}/>
                        <InputButton symbol="\tau" grow={1}/>
                    </div>
                    <div className="keypad-row">
                        <InputButton symbol="\upsilon" grow={1}/>
                        <InputButton symbol="\phi" grow={1}/>
                        <InputButton symbol="\chi" grow={1}/>
                        <InputButton symbol="\psi" grow={1}/>
                        <InputButton symbol="\omega" grow={1}/>
                    </div>
                    <div className="keypad-row">
                        <InputButton symbol="\Delta" grow={1}/>
                        <InputButton symbol="dx" grow={1}/>
                        <InputButton symbol="," grow={1}/>
                        <div style={{ flexGrow: 1 }}/>
                        <InputButton symbol="\text{Del}" grow={1}/>
                    </div>
                </KeypadSection>
                <KeypadSection id="functions">
                    <div className="keypad-row">
                        <InputButton symbol="\sin" inputValue="\sin(" grow={1}/>
                        <InputButton symbol="\cos" inputValue="\cos(" grow={1}/>
                        <InputButton symbol="\tan" inputValue="\tan(" grow={1}/>
                        <InputButton symbol="\cot" inputValue="\cot(" grow={1}/>
                        <InputButton symbol="\sec" inputValue="\sec(" grow={1}/>
                    </div>
                    <div className="keypad-row">
                        <InputButton symbol="\csc" inputValue="\csc(" grow={1}/>
                        <InputButton symbol="\sin^{-1}" inputValue="\sin^{-1}(" grow={1}/>
                        <InputButton symbol="\cos^{-1}" inputValue="\cos^{-1}(" grow={1}/>
                        <InputButton symbol="\tan^{-1}" inputValue="\tan^{-1}(" grow={1}/>
                        <InputButton symbol="\sinh" inputValue="\sinh(" grow={1}/>
                    </div>
                    <div className="keypad-row">
                        <InputButton symbol="\cosh" inputValue="\cosh(" grow={1}/>
                        <InputButton symbol="\tanh" inputValue="\tanh(" grow={1}/>
                        <InputButton symbol="\coth" inputValue="\coth(" grow={1}/>
                        <InputButton symbol="\text{sech}" inputValue="\text{sech}(" grow={1}/>
                        <InputButton symbol="\text{csch}" inputValue="\text{csch}(" grow={1}/>
                    </div>
                    <div className="keypad-row">
                        <InputButton symbol="\ln" inputValue="\ln(" grow={1}/>
                        <InputButton symbol="\lg" inputValue="\lg(" grow={1}/>
                        <InputButton symbol="\log_2{a}" inputValue="\log_2(" grow={1}/>
                        <InputButton symbol="a!" inputValue="!" grow={1}/>
                        <InputButton symbol="\exp" inputValue="\exp(" grow={1}/>
                    </div>
                    <div className="keypad-row">
                        <InputButton symbol="\text{stdev}" inputValue="\text{stdev}(" grow={1}/>
                        <InputButton symbol="\text{var}" inputValue="\text{var}(" grow={1}/>
                        <InputButton symbol="\text{stdevp}" inputValue="\text{stdevp}(" grow={3}/>
                    </div>
                    <div className="keypad-row">
                        <InputButton symbol="\text{min}" inputValue="\text{min}(" grow={1}/>
                        <InputButton symbol="\text{max}" inputValue="\text{max}(" grow={1}/>
                        <InputButton symbol="\text{median}" inputValue="\text{median}(" grow={3}/>
                    </div>
                    <div className="keypad-row">
                        <InputButton symbol="\text{count}" inputValue="\text{count}(" grow={1}/>
                        <InputButton symbol="\text{total}" inputValue="\text{total}(" grow={1}/>
                        <InputButton symbol="\text{mean}" inputValue="\text{mean}(" grow={3}/>
                    </div>
                    <div className="keypad-row">
                        <InputButton symbol="\deg" inputValue="\deg(" grow={1}/>
                        <InputButton symbol="\text{rad}" inputValue="\text{rad}(" grow={1}/>
                        <InputButton symbol="\text{nPr}" inputValue="\text{nPr}(" grow={1}/>
                        <InputButton symbol="\text{nCr}" inputValue="\text{nCr}(" grow={1}/>
                        <InputButton symbol="\text{Del}" grow={1}/>
                    </div>
                </KeypadSection>
                <KeypadSection id="professional">
                    <div className="keypad-row">
                        <InputButton symbol="\sum" grow={2}/>
                        <InputButton symbol="\int_a^b" inputValue="\int" grow={2}/>
                        <InputButton symbol="dx" grow={1}/>
                    </div>
                    <div className="keypad-row">
                        <InputButton symbol="\prod" grow={2}/>
                        <div style={{ flexGrow: 2 }}/>
                        <InputButton symbol="\text{Del}" grow={1}/>
                    </div>
                </KeypadSection>
            </div>
        </div>
    );
})

export default MobileInput;
