import React, { useRef } from "react";
 
import { Select, SelectItem } from "@/components/Select";
import { CurrencyType, currencyNameList } from "@/views/currency/CurrencyPage";
import Emitter from "@/utils/Emitter";

import useEmitter from "@/hooks/useEmitter";

interface CurrencyOutputProps {
    defaultCurrency: CurrencyType
}

const CurrencyOutput: React.FC<CurrencyOutputProps> = (props) => {
    const outputRef = useRef<HTMLTextAreaElement>(null);

    const handleSelectCurrency = (currency: CurrencyType) => {
        new Emitter().emit("output-currency-select", currency);
    };

    useEmitter([
        ["currency-loading", () => {
            if(!outputRef.current) return;

            outputRef.current.value = "...";
        }],
        ["currency-output-change", (value: number) => {
            if(!outputRef.current) return;

            outputRef.current.value = value.toString();
        }]
    ]);

    return (
        <div className="currency-output">
            <div className="currency-value">
                <textarea
                    defaultValue={0}
                    autoComplete="off"
                    disabled
                    ref={outputRef}/>
            </div>
            <div className="currency-type-selector">
                <Select
                    defaultValue={props.defaultCurrency}
                    width={170}
                    onSelect={(itemId) => handleSelectCurrency(itemId as CurrencyType)}>
                    {Array.from(currencyNameList).map(([type, name], index) => {
                        return (
                            <SelectItem id={type} key={index}>
                                <div className="currency-icon">
                                    {type.length <= 3 && <span className={"fi fi-"+ type.substring(0, 2).toLowerCase()}/>}
                                </div>
                                <div className="currency-name">
                                    <span>{name +" "+ type}</span>
                                </div>
                            </SelectItem>
                        );
                    }) as JSX.Element[]}
                </Select>
            </div>
        </div>
    );
}

export default CurrencyOutput;
