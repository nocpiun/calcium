import React from "react";
import { elements } from "chemical-elements";

interface AtomicWeightsOutputProps {
    inputElements: number[]
    result: number
}

const AtomicWeightsOutput: React.FC<AtomicWeightsOutputProps> = (props) => {
    return (
        <div className="atom-output">
            <div className="atom-input-display">
                {props.inputElements.map((number, index) => {
                    return <div className="atom-symbol" key={index}>{elements[number - 1].symbol}</div>
                })}
            </div>
            <div className="atom-output-result">
                <span>{props.result}</span>
            </div>
        </div>
    );
}

export default AtomicWeightsOutput;
