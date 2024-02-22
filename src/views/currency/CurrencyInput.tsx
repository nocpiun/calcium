import React, { useEffect, useRef } from "react";

import { Select, SelectItem } from "@/components/Select";
import { CurrencyType, currencyNameList } from "@/views/currency/CurrencyPage";
import Emitter from "@/utils/Emitter";

interface CurrencyInputProps {
    defaultCurrency: CurrencyType
}

const CurrencyInput: React.FC<CurrencyInputProps> = (props) => {
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const handleInput = (value: string) => {
        if(/[^\d.]+/.test(value) && inputRef.current) { // prevent non-number
            const str = inputRef.current.value;
            inputRef.current.value = str.replaceAll(/[^\d.]+/g, "");
            return;
        }

        new Emitter().emit("currency-input-change", parseFloat(value));
    };

    const handleSelectCurrency = (currency: CurrencyType) => {
        new Emitter().emit("input-currency-select", currency);
    };

    useEffect(() => inputRef.current?.focus());

    return (
        <div className="currency-input">
            <div className="currency-value">
                <textarea
                    defaultValue={0}
                    autoComplete="off"
                    ref={inputRef}
                    onChange={(e) => handleInput(e.target.value)}/>
            </div>
            <div className="currency-type-selector">
                <Select
                    defaultValue={props.defaultCurrency}
                    onSelect={(itemId) => handleSelectCurrency(itemId as unknown as CurrencyType)}>
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

export default CurrencyInput;
