import React from "react";

import Input from "./Input";
import Output from "./Output";

const Calculator: React.FC = () => {
    return (
        <div className="calculator-container">
            <Output/>
            <Input/>
        </div>
    );
}

export default Calculator;
