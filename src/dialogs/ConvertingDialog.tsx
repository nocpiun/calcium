import React, { forwardRef, useState, useId } from "react";

import UnitTypeButton from "@/views/unit-convert/UnitTypeButton";
import UnitsPage from "@/views/unit-convert/UnitsPage";

import useEmitter from "@/hooks/useEmitter";

import type { PropsWithRef } from "@/types";
import Dialog from "@/components/Dialog";
import { UnitType } from "@/views/unit-convert/UnitsPage";
import unitsData from "@/views/unit-convert/unitsData.json";

interface ConvertingDialogProps extends PropsWithRef<Dialog> {
    
}

const ConvertingDialog: React.FC<ConvertingDialogProps> = forwardRef<Dialog, ConvertingDialogProps>(
    (props, ref) => {
        const [currentUnitType, setUnitType] = useState<string>("length");

        useEmitter([
            ["converting-type-select", (typeId: string) => {
                setUnitType(typeId);
            }]
        ]);

        return (
            <Dialog title="单位换算" className="converting-dialog" id={"converting-dialog--"+ useId()} ref={ref}>
                <div className="dialog-sidebar">
                    {
                        unitsData.map((value: UnitType, index: number) => {
                            return <UnitTypeButton
                                name={value.name}
                                id={value.id}
                                default={value.isDefault} key={index}/>;
                        })
                    }
                </div>
                <div className="dialog-content">
                    {
                        // To prevent the data (state etc.) of the page component being not removed completely
                        unitsData.map((value: UnitType, index: number) => {
                            if(value.id === currentUnitType) {
                                return <UnitsPage id={value.id} key={index}/>
                            }
                            return null;
                        })
                    }
                </div>
            </Dialog>
        );
    }
);

export default ConvertingDialog;
