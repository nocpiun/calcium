import React from "react";

import NumberBox from "./NumberBox";
import { NumberType } from "../../types";

const ProgrammingOutput: React.FC = () => {
    return (
        <div className="output-container">
            <span className="output-tag">Output</span>

            <ul className="number-box-list">
                <NumberBox name="Hex" number={0} type={NumberType.HEX}/>
                <NumberBox name="Dec" number={0} type={NumberType.DEC}/>
                <NumberBox name="Oct" number={0} type={NumberType.OCT}/>
                <NumberBox name="Bin" number={0} type={NumberType.BIN}/>
            </ul>
        </div>
    );
}

export default ProgrammingOutput;
