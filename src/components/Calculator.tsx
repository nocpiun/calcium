import React, { useContext } from "react";

import { Mode } from "../types";

import Input from "../views/general/Input";
import ProgrammingInput from "../views/programming/ProgrammingInput";
import Output from "../views/general/Output";
import ProgrammingOutput from "../views/programming/ProgrammingOutput";
import Graphing from "../views/graphing";

import MainContext from "../contexts/MainContext";

const Calculator: React.FC = () => {
    const { mode } = useContext(MainContext);
    
    const layoutSwitch = (calcMode: Mode) => {
        switch(calcMode) {
            case Mode.GENERAL:
                return (
                    <>
                        <Output/>
                        <Input/>
                    </>
                );
            case Mode.GRAPHING:
                return <Graphing/>;
            case Mode.PROGRAMMING:
                return (
                    <>
                        <ProgrammingOutput/>
                        <ProgrammingInput/>
                    </>
                );
        }
    };

    return (
        <div className="calculator-container" data-mode={mode}>
            {layoutSwitch(mode)}
        </div>
    );
}

export default Calculator;
