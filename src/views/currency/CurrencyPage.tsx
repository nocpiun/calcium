import React, { useState, useEffect, useCallback, useMemo } from "react";
import Axios from "axios";

import CurrencyInput from "@/views/currency/CurrencyInput";
import CurrencyOutput from "@/views/currency/CurrencyOutput";
import Emitter from "@/utils/Emitter";
import Float from "@/compiler/Float";

import useEmitter from "@/hooks/useEmitter";

const fetchURL = "https://unpkg.com/@fawazahmed0/currency-api@latest/v1/currencies/";

export enum CurrencyType {
    USD = "USD",
    EUR = "EUR",
    CNY = "CNY",
    CNH = "CNH",
    HKD = "HKD",
    TWD = "TWD",
    JPY = "JPY",
    RUB = "RUB",
    UAH = "UAH",
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
    KPW = "KPW",
    MXN = "MXN",
    MYR = "MYR",
    NZD = "NZD",
    PHP = "PHP",
    SGD = "SGD",
    THB = "THB",
    ZAR = "ZAR",
    VND = "VND",
    MNT = "MNT",
    JMD = "JMD",
    ZWL = "ZWL",
    
    XAU = "$XAU",
    XAG = "$XAG",
    XCP = "$XCP",
    XPD = "$XPD",
    XPT = "$XPT",
    BTC = "$BTC",
    ETH = "$ETH",
    LTC = "$LTC",
    USDT = "$USDT",
    AGLD = "$AGLD",
    DOGE = "$DOGE",
    SHIB = "$SHIB",
}

export const currencyNameList: Map<string | CurrencyType, string> = new Map([
    ["USD", "美元"],
    ["EUR", "欧元"],
    ["CNY", "人民币"],
    ["CNH", "中国离岸人民币"],
    ["HKD", "港币"],
    ["TWD", "新台币"],
    ["JPY", "日元"],
    ["RUB", "俄罗斯卢布"],
    ["UAH", "乌克兰格里夫纳"],
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
    ["KPW", "朝鲜元"],
    ["MXN", "墨西哥比索"],
    ["MYR", "马来西亚林吉特"],
    ["NZD", "新西兰元"],
    ["PHP", "菲律宾比索"],
    ["SGD", "新加坡元"],
    ["THB", "泰铢"],
    ["ZAR", "南非兰特"],
    ["VND", "越南盾"],
    ["MNT", "蒙古图格里克"],
    ["JMD", "牙买加元"],
    ["ZWL", "津巴布韦元"],

    ["$XAU", "金价盎司"],
    ["$XAG", "银价盎司"],
    ["$XCP", "铜价盎司"],
    ["$XPD", "钯价盎司"],
    ["$XPT", "铂价盎司"],
    ["$BTC", "比特币"],
    ["$ETH", "以太坊"],
    ["$LTC", "莱特币"],
    ["$USDT", "泰达币"],
    ["$AGLD", "Adventure Gold"],
    ["$DOGE", "狗狗币"],
    ["$SHIB", "柴犬币"],
]);

function getCode(currency: CurrencyType): string {
    return currency.toLowerCase().replaceAll("$", "");
}

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

        const { data } = await Axios.get<ExchangeRateResponse>(fetchURL + getCode(inputCurrency) +".json");
        return data;
    }, [inputCurrency]);

    const handleExchange = useCallback(async () => {
        new Emitter().emit(
            "currency-output-change",
            Float.multiply(inputValue, (await rateData)[getCode(inputCurrency)][getCode(outputCurrency)])
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
