import React, { useRef } from "react";

import Float from "../../compiler/Float";

import type { UnitType, UnitInfo } from "../../types";
import Emitter from "../../utils/Emitter";

import useEmitter from "../../hooks/useEmitter";

interface UnitItemType extends UnitInfo {
    unitType: UnitType
}

const UnitItem: React.FC<UnitItemType> = (props) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const unitType = props.unitType;
    const unitList = unitType.units;

    function getTransformRate(unitId: string): number {
        for(let i = 0; i < unitList.length; i++) {
            if(unitList[i].name === unitId) return unitList[i].transform;
        }
        return -1;
    }

    const handleClick = () => {
        Emitter.get().emit("unit-value-reset");
    };

    const handleInput = (value: string) => {
        // If inputing a float number (which has ".")
        // This is in order to make the "." available for inputing
        if(value[value.length - 1] === ".") return;

        Emitter.get().emit("unit-value-input", props.name, parseFloat(value) || 0);
    };

    useEmitter([
        ["unit-value-reset", () => {
            if(!inputRef.current) return;

            inputRef.current.value = "0";
        }],
        ["unit-value-input", (originUnitId: string, value: number) => {
            if(!inputRef.current) return;
            var originRate = getTransformRate(originUnitId);
            var targetRate = getTransformRate(props.name);
            /**
             * result = value * originRate / targetRate
             * 
             * Example: 1cm -> 0.1dm
             * 1cm * 0.01 = 0.01m
             * 0.01m / 0.1 = 0.1dm
             * 
             * `0.01` is the transform rate of cm.
             * `0.1` is the transform rate of dm.
             */
            inputRef.current.value = Float.eTransfer(Float.divide(Float.multiply(value, originRate), targetRate));
        }]
    ]);

    return (
        <div className="unit-item">
            <div className="unit-value-input">
                <input
                    type="text"
                    id={"value-input--"+ props.name}
                    onClick={() => handleClick()}
                    onChange={(e) => handleInput(e.target.value)}
                    defaultValue={0}
                    autoComplete="off"
                    ref={inputRef}/>
            </div>
            <div className="unit-info">
                <span className="unit-name">{props.name}</span>
                <span className="unit-display-name">{props.displayName}</span>
            </div>
        </div>
    );
}

export default UnitItem;
