import React, { useState, useEffect, useCallback, useMemo } from "react";
import Axios from "axios";

import CurrencyInput from "@/views/currency/CurrencyInput";
import CurrencyOutput from "@/views/currency/CurrencyOutput";
import Emitter from "@/utils/Emitter";
import Float from "@/compiler/Float";

import useEmitter from "@/hooks/useEmitter";

const fetchURL = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/";

export enum CurrencyType {
    USD = "USD",
    EUR = "EUR",
    CNY = "CNY",
    HKD = "HKD",
    TWD = "TWD",
    JPY = "JPY",
    BGN = "BGN",
    CZK = "CZK",
    DKK = "DKK",
    GBP = "GBP",
    HUF = "HUF",
    PLN = "PLN",
    RON = "RON",
    SEK = "SEK",
    CHF = "CHF",
    ISK = "ISK",
    NOK = "NOK",
    TRY = "TRY",
    AUD = "AUD",
    BRL = "BRL",
    CAD = "CAD",
    IDR = "IDR",
    ILS = "ILS",
    INR = "INR",
    KRW = "KRW",
    MXN = "MXN",
    MYR = "MYR",
    NZD = "NZD",
    PHP = "PHP",
    SGD = "SGD",
    THB = "THB",
    ZAR = "ZAR",
}

export const currencyNameList: Map<string | CurrencyType, string> = new Map([
    ["USD", "美元"],
    ["EUR", "欧元"],
    ["CNY", "人民币"],
    ["HKD", "港币"],
    ["TWD", "新台币"],
    ["JPY", "日元"],
    ["BGN", "保加利亚列弗"],
    ["CZK", "捷克克朗"],
    ["DKK", "丹麦克朗"],
    ["GBP", "英镑"],
    ["HUF", "匈牙利福林"],
    ["PLN", "波兰兹罗提"],
    ["RON", "罗马尼亚列伊"],
    ["SEK", "瑞典克朗"],
    ["CHF", "瑞士法郎"],
    ["ISK", "冰岛克朗"],
    ["NOK", "挪威克朗"],
    ["TRY", "土耳其里拉"],
    ["AUD", "澳元"],
    ["BRL", "巴西雷亚尔"],
    ["CAD", "加元"],
    ["IDR", "印尼盾"],
    ["ILS", "以色列谢克尔"],
    ["INR", "印度卢比"],
    ["KRW", "韩元"],
    ["MXN", "墨西哥比索"],
    ["MYR", "马来西亚林吉特"],
    ["NZD", "新西兰元"],
    ["PHP", "菲律宾比索"],
    ["SGD", "新加坡元"],
    ["THB", "泰铢"],
    ["ZAR", "南非兰特"],
]);

interface ExchangeRateResponse {
    date: string
    [key: string]: { [key: string]: number } | any
}

const CurrencyPage: React.FC = () => {
    const [inputValue, setInputValue] = useState<number>(0);
    const [[inputCurrency, outputCurrency], setCurrencyTypes] = useState<[CurrencyType, CurrencyType]>(
        [CurrencyType.USD, CurrencyType.CNY]
    );
    const rateData = useMemo(async () => {
        new Emitter().emit("currency-loading");

        const { data } = await Axios.get<ExchangeRateResponse>(fetchURL + inputCurrency.toLowerCase() +".json");
        return data;
    }, [inputCurrency]);

    const handleExchange = useCallback(async () => {
        new Emitter().emit(
            "currency-output-change",
            Float.multiply(inputValue, (await rateData)[inputCurrency.toLowerCase()][outputCurrency.toLowerCase()])
        );
    }, [inputValue, inputCurrency, outputCurrency, rateData]);

    useEffect(() => {
        handleExchange();
    }, [handleExchange]);

    useEmitter([
        ["currency-input-change", (value: number) => {
            !isNaN(value) && setInputValue(value);
        }],
        ["input-currency-select", (currency: CurrencyType) => setCurrencyTypes(([_, currentOutputCurrency]) => [currency, currentOutputCurrency])],
        ["output-currency-select", (currency: CurrencyType) => setCurrencyTypes(([currentInputCurrency]) => [currentInputCurrency, currency])],
    ]);

    return (
        <div className="currency-page">
            <CurrencyInput defaultCurrency={inputCurrency}/>
            <CurrencyOutput defaultCurrency={outputCurrency}/>
        </div>
    );
}

export default CurrencyPage;
