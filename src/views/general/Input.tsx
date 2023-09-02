import React, { memo } from "react";
import { useContextMenu, ContextMenuItem, ContextMenuDivider } from "use-context-menu";

import InputButton from "../../components/InputButton";

import Emitter from "../../utils/Emitter";

const Input: React.FC = memo(() => {
    const { contextMenu, onContextMenu } = useContextMenu(
        <>
            <ContextMenuItem onSelect={() => Emitter.get().emit("do-input", "\\text{Result}")}>计算结果...</ContextMenuItem>
            <ContextMenuItem onSelect={() => Emitter.get().emit("clear-input")}>清空</ContextMenuItem>
            <ContextMenuItem onSelect={() => Emitter.get().emit("clear-record")}>清空历史</ContextMenuItem>
            <ContextMenuDivider />
            <ContextMenuItem onSelect={() => Emitter.get().emit("open-vars-dialog")}>变量...</ContextMenuItem>
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
                        <InputButton symbol="\sin" inputValue="\sin(" grow={1}/>
                        <InputButton symbol="\cos" inputValue="\cos(" grow={1}/>
                        <InputButton symbol="\tan" inputValue="\tan(" grow={1}/>
                        <InputButton symbol="\cot" inputValue="\cot(" grow={1}/>
                        <InputButton symbol="\sec" inputValue="\sec(" grow={1}/>
                        <div className="keypad-placeholder"/>
                        <InputButton symbol="a^2" inputValue="^2" grow={1}/>
                        <InputButton symbol="a^3" inputValue="^3" grow={1}/>
                        <InputButton symbol="\sqrt{a}" inputValue="√(" grow={1}/>
                        <InputButton symbol="\sqrt[3]{a}" inputValue="^3√(" grow={1}/>
                        <div className="keypad-placeholder"/>
                        <InputButton symbol="a" grow={1}/>
                        <InputButton symbol="b" grow={1}/>
                        <InputButton symbol="c" grow={1}/>
                        <InputButton symbol="d" grow={1}/>
                        <InputButton symbol="e" grow={1}/>
                        <div className="keypad-placeholder"/>
                        <InputButton symbol="\sum" grow={2}/>
                        <InputButton symbol="\int_a^b" inputValue="\int" grow={2}/>
                        <InputButton symbol="dx" grow={1}/>
                    </div>
                    <div className="keypad-row">
                        <InputButton symbol="\csc" inputValue="\csc(" grow={1}/>
                        <InputButton symbol="\sin^{-1}" inputValue="\sin^{-1}(" grow={1}/>
                        <InputButton symbol="\cos^{-1}" inputValue="\cos^{-1}(" grow={1}/>
                        <InputButton symbol="\tan^{-1}" inputValue="\tan^{-1}(" grow={1}/>
                        <InputButton symbol="\sinh" inputValue="\sinh(" grow={1}/>
                        <div className="keypad-placeholder"/>
                        <InputButton symbol="|a|" inputValue="|" grow={1}/>
                        <InputButton symbol="e" grow={1}/>
                        <InputButton symbol="\pi" grow={1}/>
                        <InputButton symbol="x^x" inputValue="\text{xPx}(" grow={1}/>
                        <div className="keypad-placeholder"/>
                        <InputButton symbol="f" grow={1}/>
                        <InputButton symbol="g" grow={1}/>
                        <InputButton symbol="h" grow={1}/>
                        <InputButton symbol="i" grow={1}/>
                        <InputButton symbol="j" grow={1}/>
                        <div className="keypad-placeholder"/>
                        <InputButton symbol="\prod" grow={2}/>
                        <div style={{ flexGrow: 3 }}/>
                    </div>
                    <div className="keypad-row">
                        <InputButton symbol="\cosh" inputValue="\cosh(" grow={1}/>
                        <InputButton symbol="\tanh" inputValue="\tanh(" grow={1}/>
                        <InputButton symbol="\coth" inputValue="\coth(" grow={1}/>
                        <InputButton symbol="\text{sech}" inputValue="\text{sech}(" grow={1}/>
                        <InputButton symbol="\text{csch}" inputValue="\text{csch}(" grow={1}/>
                        <div className="keypad-placeholder"/>
                        <InputButton symbol="(" grow={1}/>
                        <InputButton symbol=")" grow={1}/>
                        <InputButton symbol="\sin" inputValue="\sin(" grow={1}/>
                        <InputButton symbol="\cos" inputValue="\cos(" grow={1}/>
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
                        <InputButton symbol="\ln" inputValue="\ln(" grow={1}/>
                        <InputButton symbol="\lg" inputValue="\lg(" grow={1}/>
                        <InputButton symbol="\log_2{a}" inputValue="\log_2(" grow={1}/>
                        <InputButton symbol="a!" inputValue="!" grow={1}/>
                        <InputButton symbol="\exp" inputValue="\exp(" grow={1}/>
                        <div className="keypad-placeholder"/>
                        <InputButton symbol="[" grow={1}/>
                        <InputButton symbol="]" grow={1}/>
                        <InputButton symbol="\tan" inputValue="\tan(" grow={1}/>
                        <InputButton symbol="\cot" inputValue="\cot(" grow={1}/>
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
                        <InputButton symbol="\text{stdev}" inputValue="\text{stdev}(" grow={1}/>
                        <InputButton symbol="\text{var}" inputValue="\text{var}(" grow={1}/>
                        <InputButton symbol="\text{stdevp}" inputValue="\text{stdevp}(" grow={2}/>
                        <InputButton symbol="\deg" inputValue="\deg(" grow={1}/>
                        <div className="keypad-placeholder"/>
                        <InputButton symbol="\{" grow={1} disabled/>
                        <InputButton symbol="\}" grow={1} disabled/>
                        <InputButton symbol="\sec" inputValue="\sec(" grow={1}/>
                        <InputButton symbol="\csc" inputValue="\csc(" grow={1}/>
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
                        <InputButton symbol="\text{min}" inputValue="\text{min}(" grow={1}/>
                        <InputButton symbol="\text{max}" inputValue="\text{max}(" grow={1}/>
                        <InputButton symbol="\text{median}" inputValue="\text{median}(" grow={2}/>
                        <InputButton symbol="\text{rad}" inputValue="\text{rad}(" grow={1}/>
                        <div className="keypad-placeholder"/>
                        <InputButton symbol="\leftarrow" grow={1} title="向前移动光标"/>
                        <InputButton symbol="\rightarrow" grow={1} title="向后移动光标"/>
                        <InputButton symbol="\text{Clear}" grow={1} title="清空输入框"/>
                        <InputButton symbol="\text{Del}" grow={1} title="退格"/>
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
                        <InputButton symbol="\text{count}" inputValue="\text{count}(" grow={1}/>
                        <InputButton symbol="\text{total}" inputValue="\text{total}(" grow={1}/>
                        <InputButton symbol="\text{mean}" inputValue="\text{mean}(" grow={2}/>
                        <InputButton symbol="\text{nPr}" inputValue="\text{nPr}(" grow={1}/>
                        <div className="keypad-placeholder"/>
                        <InputButton symbol="\sum" inputValue="\sum" grow={1}/>
                        <InputButton symbol="\%" inputValue="\%(" grow={1}/>
                        <InputButton symbol="×" grow={1}/>
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
                        <InputButton symbol="\text{floor}" inputValue="\text{floor}(" grow={2}/>
                        <InputButton symbol="\text{round}" inputValue="\text{round}(" grow={2}/>
                        <InputButton symbol="\text{nCr}" inputValue="\text{nCr}(" grow={1}/>
                        <div className="keypad-placeholder"/>
                        <InputButton symbol="1" grow={1}/>
                        <InputButton symbol="2" grow={1}/>
                        <InputButton symbol="3" grow={1}/>
                        <InputButton symbol="+" grow={1}/>
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
                        <InputButton symbol="\text{rand}" inputValue="\text{rand}(" grow={2}/>
                        <div style={{ flexGrow: 3 }}/>
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
                        <InputButton symbol="=" grow={1}/>
                        <div className="keypad-placeholder"/>
                        <InputButton symbol="\upsilon" grow={1}/>
                        <InputButton symbol="\phi" grow={1}/>
                        <InputButton symbol="\chi" grow={1}/>
                        <InputButton symbol="\psi" grow={1}/>
                        <InputButton symbol="\omega" grow={1}/>
                        <div className="keypad-placeholder"/>
                        <InputButton symbol="\leftarrow" grow={1} title="向前移动光标"/>
                        <InputButton symbol="\rightarrow" grow={1} title="向后移动光标"/>
                        <div style={{ flexGrow: 3 }}/>
                    </div>
                    <div className="keypad-row">
                        <div style={{ flexGrow: 5 }}/>
                        <div className="keypad-placeholder"/>
                        <InputButton symbol="0" grow={1}/>
                        <InputButton symbol="." grow={1}/>
                        <InputButton symbol="\text{Result}" grow={2}/>
                        <div className="keypad-placeholder"/>
                        <InputButton symbol="\Delta" grow={1}/>
                        <InputButton symbol="," grow={1}/>
                        <div style={{ flexGrow: 3 }}/>
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

export default Input;
