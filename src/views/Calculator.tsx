import React, { useContext } from "react";

import { Mode } from "@/types";

import Input from "@/views/general/Input";
import MobileInput from "@/views/general/MobileInput";
import ProgrammingInput from "@/views/programming/ProgrammingInput";
import MobileProgrammingInput from "@/views/programming/MobileProgrammingInput";
import Output from "@/views/general/Output";
import ProgrammingOutput from "@/views/programming/ProgrammingOutput";
import Graphing from "@/views/graphing";

import MainContext from "@/contexts/MainContext";

const Calculator: React.FC = () => {
    const { mode } = useContext(MainContext);
    
    const layoutSwitcher = (calcMode: Mode) => {
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
                        <MobileProgrammingInput />
                    </>
                );
        }
    };

    return (
        <div className="calculator-container" data-mode={mode}>
            {layoutSwitcher(mode)}
        </div>
    );
}

export default Calculator;
