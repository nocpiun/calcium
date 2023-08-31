import React, { useContext } from "react";

import { Mode } from "../types";

import Input from "./general/Input";
import MobileInput from "./general/MobileInput";
import ProgrammingInput from "./programming/ProgrammingInput";
import Output from "./general/Output";
import ProgrammingOutput from "./programming/ProgrammingOutput";
import Graphing from "./graphing";

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
                        <MobileInput />
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
