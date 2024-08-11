import React, { useRef } from "react";
import BigNumber from "bignumber.js";

import ComputeKits from "@/compiler/ComputeKits";

import type { UnitType, UnitInfo } from "@/views/unit-convert/UnitsPage";
import Emitter from "@/utils/Emitter";

import useEmitter from "@/hooks/useEmitter";

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
        new Emitter().emit("unit-value-reset");
    };

    const handleInput = (value: string) => {
        // If inputing a float number (which has ".")
        // This is in order to make the "." available for inputing
        if(value[value.length - 1] === ".") return;

        new Emitter().emit("unit-value-input", props.name, new BigNumber(value).toNumber() || 0);
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

            if(originRate === targetRate) return; // self -> self is meaningless

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
            inputRef.current.value = ComputeKits.eTransfer(ComputeKits.divide(ComputeKits.multiply(value, originRate), targetRate));
        }]
    ]);

    return (
        <div className="unit-item">
            <div className="unit-info">
                <span className="unit-name">{props.name}</span>
                <span className="unit-display-name">{props.displayName}</span>
            </div>
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
        </div>
    );
}

export default UnitItem;
