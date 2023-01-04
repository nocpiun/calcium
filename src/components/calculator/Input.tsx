import React from "react";

import InputButton from "./InputButton";

const Input: React.FC = () => {
    return (
        <div className="input-container">
            <div className="keypad">
                <div className="keypad-row">
                    <InputButton symbol="\sin" grow={1}/>
                    <InputButton symbol="\cos" grow={1}/>
                    <InputButton symbol="\tan" grow={1}/>
                    <InputButton symbol="\cot" grow={1}/>
                    <InputButton symbol="\sec" grow={1}/>
                    <div className="keypad-placeholder"/>
                    <InputButton symbol="a^2" grow={1}/>
                    <InputButton symbol="a^b" grow={1}/>
                    <InputButton symbol="|a|" grow={1}/>
                    <InputButton symbol="\sqrt{a}" grow={1}/>
                    <div className="keypad-placeholder"/>
                    <InputButton symbol="a" grow={1}/>
                    <InputButton symbol="b" grow={1}/>
                    <InputButton symbol="c" grow={1}/>
                    <InputButton symbol="d" grow={1}/>
                    <InputButton symbol="e" grow={1}/>
                    <div className="keypad-placeholder"/>
                    <div style={{ flexGrow: 5 }}/>
                </div>
                <div className="keypad-row">
                    <InputButton symbol="\csc" grow={1}/>
                    <InputButton symbol="\sin^{-1}" grow={1}/>
                    <InputButton symbol="\cos^{-1}" grow={1}/>
                    <InputButton symbol="\tan^{-1}" grow={1}/>
                    <InputButton symbol="\sinh" grow={1}/>
                    <div className="keypad-placeholder"/>
                    <InputButton symbol="\sqrt[n]{a}" grow={1}/>
                    <InputButton symbol="e" grow={1}/>
                    <InputButton symbol="\pi" grow={1}/>
                    <InputButton symbol="," grow={1}/>
                    <div className="keypad-placeholder"/>
                    <InputButton symbol="f" grow={1}/>
                    <InputButton symbol="g" grow={1}/>
                    <InputButton symbol="h" grow={1}/>
                    <InputButton symbol="i" grow={1}/>
                    <InputButton symbol="j" grow={1}/>
                    <div className="keypad-placeholder"/>
                    <div style={{ flexGrow: 5 }}/>
                </div>
                <div className="keypad-row">
                    <InputButton symbol="\cosh" grow={1}/>
                    <InputButton symbol="\tanh" grow={1}/>
                    <InputButton symbol="\coth" grow={1}/>
                    <InputButton symbol="\text{sech}" grow={1}/>
                    <InputButton symbol="\text{csch}" grow={1}/>
                    <div className="keypad-placeholder"/>
                    <InputButton symbol="(" grow={1}/>
                    <InputButton symbol=")" grow={1}/>
                    <InputButton symbol="\sin" grow={1}/>
                    <InputButton symbol="\cos" grow={1}/>
                    <div className="keypad-placeholder"/>
                    <InputButton symbol="k" grow={1}/>
                    <InputButton symbol="l" grow={1}/>
                    <InputButton symbol="m" grow={1}/>
                    <InputButton symbol="n" grow={1}/>
                    <InputButton symbol="o" grow={1}/>
                    <div className="keypad-placeholder"/>
                    <div style={{ flexGrow: 5 }}/>
                </div>
                <div className="keypad-row">
                    <InputButton symbol="\sinh^{-1}" grow={1}/>
                    <InputButton symbol="\cosh^{-1}" grow={1}/>
                    <InputButton symbol="\tanh^{-1}" grow={1}/>
                    <InputButton symbol="\coth^{-1}" grow={1}/>
                    <InputButton symbol="\text{sech}^{-1}" grow={1}/>
                    <div className="keypad-placeholder"/>
                    <InputButton symbol="[" grow={1}/>
                    <InputButton symbol="]" grow={1}/>
                    <InputButton symbol="\tan" grow={1}/>
                    <InputButton symbol="\cot" grow={1}/>
                    <div className="keypad-placeholder"/>
                    <InputButton symbol="p" grow={1}/>
                    <InputButton symbol="q" grow={1}/>
                    <InputButton symbol="r" grow={1}/>
                    <InputButton symbol="s" grow={1}/>
                    <InputButton symbol="t" grow={1}/>
                    <div className="keypad-placeholder"/>
                    <div style={{ flexGrow: 5 }}/>
                </div>
                <div className="keypad-row">
                    <InputButton symbol="\text{csch}^{-1}" grow={1}/>
                    <InputButton symbol="\log_n{a}" grow={1}/>
                    <InputButton symbol="\ln" grow={1}/>
                    <InputButton symbol="\lg" grow={1}/>
                    <InputButton symbol="a!" grow={1}/>
                    <div className="keypad-placeholder"/>
                    <InputButton symbol="\{" grow={1}/>
                    <InputButton symbol="\}" grow={1}/>
                    <InputButton symbol="\sec" grow={1}/>
                    <InputButton symbol="\csc" grow={1}/>
                    <div className="keypad-placeholder"/>
                    <InputButton symbol="u" grow={1}/>
                    <InputButton symbol="v" grow={1}/>
                    <InputButton symbol="w" grow={1}/>
                    <InputButton symbol="x" grow={1}/>
                    <InputButton symbol="y" grow={1}/>
                    <div className="keypad-placeholder"/>
                    <div style={{ flexGrow: 5 }}/>
                </div>
                <div className="keypad-row">
                    <InputButton symbol="\deg" grow={1}/>
                    <div style={{ flexGrow: 4 }}/>
                    <div className="keypad-placeholder"/>
                    <InputButton symbol="\leftarrow" grow={1}/>
                    <InputButton symbol="\rightarrow" grow={1}/>
                    <InputButton symbol="\text{Clear}" grow={1}/>
                    <InputButton symbol="\text{Del}" grow={1}/>
                    <div className="keypad-placeholder"/>
                    <InputButton symbol="z" grow={1}/>
                    <InputButton symbol="\alpha" grow={1}/>
                    <InputButton symbol="\beta" grow={1}/>
                    <InputButton symbol="\gamma" grow={1}/>
                    <InputButton symbol="\delta" grow={1}/>
                    <div className="keypad-placeholder"/>
                    <div style={{ flexGrow: 5 }}/>
                </div>
                <div className="keypad-row">
                    <div style={{ flexGrow: 5 }}/>
                    <div className="keypad-placeholder"/>
                    <InputButton symbol="\%" grow={2}/>
                    <InputButton symbol="\dfrac{a}{b}" grow={1} disabled={true}/>
                    <InputButton symbol="/" grow={1}/>
                    <div className="keypad-placeholder"/>
                    <InputButton symbol="\epsilon" grow={1}/>
                    <InputButton symbol="\zeta" grow={1}/>
                    <InputButton symbol="\eta" grow={1}/>
                    <InputButton symbol="\theta" grow={1}/>
                    <InputButton symbol="\iota" grow={1}/>
                    <div className="keypad-placeholder"/>
                    <div style={{ flexGrow: 5 }}/>
                </div>
                <div className="keypad-row">
                    <div style={{ flexGrow: 5 }}/>
                    <div className="keypad-placeholder"/>
                    <InputButton symbol="1" grow={1}/>
                    <InputButton symbol="2" grow={1}/>
                    <InputButton symbol="3" grow={1}/>
                    <InputButton symbol="×" grow={1}/>
                    <div className="keypad-placeholder"/>
                    <InputButton symbol="\kappa" grow={1}/>
                    <InputButton symbol="\lambda" grow={1}/>
                    <InputButton symbol="\mu" grow={1}/>
                    <InputButton symbol="\nu" grow={1}/>
                    <InputButton symbol="\xi" grow={1}/>
                    <div className="keypad-placeholder"/>
                    <div style={{ flexGrow: 5 }}/>
                </div>
                <div className="keypad-row">
                    <div style={{ flexGrow: 5 }}/>
                    <div className="keypad-placeholder"/>
                    <InputButton symbol="4" grow={1}/>
                    <InputButton symbol="5" grow={1}/>
                    <InputButton symbol="6" grow={1}/>
                    <InputButton symbol="-" grow={1}/>
                    <div className="keypad-placeholder"/>
                    <InputButton symbol="\omicron" grow={1}/>
                    <InputButton symbol="\pi" grow={1}/>
                    <InputButton symbol="\rho" grow={1}/>
                    <InputButton symbol="\sigma" grow={1}/>
                    <InputButton symbol="\tau" grow={1}/>
                    <div className="keypad-placeholder"/>
                    <div style={{ flexGrow: 5 }}/>
                </div>
                <div className="keypad-row">
                    <div style={{ flexGrow: 5 }}/>
                    <div className="keypad-placeholder"/>
                    <InputButton symbol="7" grow={1}/>
                    <InputButton symbol="8" grow={1}/>
                    <InputButton symbol="9" grow={1}/>
                    <InputButton symbol="+" grow={1}/>
                    <div className="keypad-placeholder"/>
                    <InputButton symbol="\upsilon" grow={1}/>
                    <InputButton symbol="\phi" grow={1}/>
                    <InputButton symbol="\chi" grow={1}/>
                    <InputButton symbol="\psi" grow={1}/>
                    <InputButton symbol="\omega" grow={1}/>
                    <div className="keypad-placeholder"/>
                    <div style={{ flexGrow: 5 }}/>
                </div>
                <div className="keypad-row">
                    <div style={{ flexGrow: 5 }}/>
                    <div className="keypad-placeholder"/>
                    <InputButton symbol="0" grow={1}/>
                    <InputButton symbol="." grow={1}/>
                    <InputButton symbol="=" grow={2}/>
                    <div className="keypad-placeholder"/>
                    <InputButton symbol="\Delta" grow={1}/>
                    <div style={{ flexGrow: 4 }}/>
                    <div className="keypad-placeholder"/>
                    <div style={{ flexGrow: 5 }}/>
                </div>
            </div>
        </div>
    );
}

export default Input;
