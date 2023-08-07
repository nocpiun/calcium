import React, { useState, useEffect, useRef } from "react";

import HistoryItem from "./HistoryItem";
import Emitter from "../../utils/Emitter";
import Utils from "../../utils/Utils";
import { NumberSys, RecordType } from "../../types";

export interface HistoryItemInfo {
    input: string
    output: string
    type: RecordType
    numberSys: NumberSys
}

const History: React.FC = () => {
    const [list, setList] = useState<HistoryItemInfo[]>([]);
    const listElemRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        Utils.scrollToEnd("history-list", 1, 0);

        Emitter.get().on("add-record", (input: string, output: string, type: RecordType, numberSys: NumberSys) => {
            setList((currentList) => {
                return [...currentList, { input, output, type, numberSys }];
            });
        });

        Emitter.get().on("clear-record", () => {
            setList(() => []);
        });
    }, []);

    useEffect(() => {
        if(!listElemRef.current) return;
        
        listElemRef.current.scroll({
            top: listElemRef.current.scrollHeight
        });
    }, [list]);

    return (
        <div className="history">
            <div className="history-header">
                <h1>历史记录</h1>
                <span className="tip"><kbd>ctrl+d</kbd> 清空记录</span>
            </div>
            <div className="history-main" id="history-list" ref={listElemRef}>
                {
                    list.map((item, index) => <HistoryItem {...item} key={index}/>)
                }
            </div>
        </div>
    );
}

export default History;
