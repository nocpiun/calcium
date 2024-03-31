import React, { useState, useContext } from "react";
import { elements } from "chemical-elements";

import AtomicWeightsInput from "@/views/atomic-weights/AtomicWeightsInput";
import AtomicWeightsOutput from "@/views/atomic-weights/AtomicWeightsOutput";

import Utils from "@/utils/Utils";

import useEmitter from "@/hooks/useEmitter";
import AtomicWeightsContext from "@/contexts/AtomicWeightsContext";

export function getAtomicWeight(number: number): number {
    if(number === 17) return 35.5;
    if(number === 29) return 63.5;

    const mass = elements[number - 1].mass;
    if(!mass) return 0; // null

    return Math.round(mass);
}

const AtomicWeightsPage: React.FC = () => {
    const { setResult } = useContext(AtomicWeightsContext);
    const [inputElements, setInputElements] = useState<number[]>([]);

    const handleClear = () => {
        setResult(0);
        setInputElements([]);
    };

    useEmitter([
        ["atom-input", (number: number) => {
            setResult((current) => current + getAtomicWeight(number));
            setInputElements((current) => [...current, number]);
        }],
        ["atom-backspace", async () => {
            var currentInputElements = await Utils.getCurrentState(setInputElements);

            setResult((current) => current - getAtomicWeight(currentInputElements[currentInputElements.length - 1]));
            setInputElements((current) => {
                if(current.length === 0) return current;

                return current.slice(0, current.length - 1);
            });
        }],
        ["atom-clear", () => handleClear()],
        ["atomic-weights-dialog-close", () => handleClear()]
    ]);

    return (
        <>
            <AtomicWeightsOutput inputElements={inputElements}/>
            <AtomicWeightsInput />
        </>
    );
}

export default AtomicWeightsPage;
