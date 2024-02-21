import React from "react";

import unitsData from "@/views/unit-convert/unitsData.json";
import UnitItem from "@/views/unit-convert/UnitItem";

export interface UnitType {
    id: string
    name: string
    isDefault: boolean
    units: UnitInfo[]
}

export interface UnitInfo {
    name: string
    displayName: string
    transform: number
    isBase: boolean
}

interface UnitsPageProps {
    id: string
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

const UnitsPage: React.FC<UnitsPageProps> = (props) => {
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

export default UnitsPage;
