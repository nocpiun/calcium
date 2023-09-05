import React from "react";

import type { UnitType, UnitInfo } from "@/types";
import unitsData from "@/views/unit-convert/unitsData.json";
import UnitItem from "@/views/unit-convert/UnitItem";

interface UnitsPageType {
    id: string
}

const UnitsPage: React.FC<UnitsPageType> = (props) => {
    const id = props.id;
    const unitType = getUnitType(id);
    const unitList = getUnitList(id);

    return (
        <div className="units-page" id={id}>
            {
                unitList.map((unitInfo: UnitInfo, index: number) => {
                    return <UnitItem {...unitInfo} unitType={unitType} key={index}/>
                })
            }
        </div>
    );
}

function getUnitType(id: string): UnitType {
    for(let i = 0; i < unitsData.length; i++) {
        if(unitsData[i].id === id) return unitsData[i];
    }
    return unitsData[0];
}

function getUnitList(id: string): UnitInfo[] {
    var unitType = getUnitType(id);
    if(unitType) return unitType.units;
    return [];
}

export default UnitsPage;
