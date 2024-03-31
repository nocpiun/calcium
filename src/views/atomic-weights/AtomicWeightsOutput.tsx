import React, { useContext } from "react";
import { elements } from "chemical-elements";

import AtomicWeightsContext from "@/contexts/AtomicWeightsContext";

interface AtomicWeightsOutputProps {
    inputElements: number[]
}

const AtomicWeightsOutput: React.FC<AtomicWeightsOutputProps> = (props) => {
    const { result } = useContext(AtomicWeightsContext);

    return (
        <div className="atom-output">
            <div className="atom-input-display">
                {props.inputElements.map((number, index) => {
                    return <div className="atom-symbol" key={index}>{elements[number - 1].symbol}</div>
                })}
            </div>
            <div className="atom-output-result">
                <span>{result}</span>
            </div>
        </div>
    );
}

export default AtomicWeightsOutput;
