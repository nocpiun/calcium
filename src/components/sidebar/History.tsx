import React, { useState, useEffect } from "react";

import HistoryItem from "./HistoryItem";
import Emitter from "../../utils/Emitter";
import Utils from "../../utils/Utils";

interface HistoryItemInfo {
    input: string
    output: string
}

const History: React.FC = () => {
    const [list, setList] = useState<HistoryItemInfo[]>([]);

    useEffect(() => {
        Utils.scrollToEnd("history-list", 1, 0);

        Emitter.get().once("add-record", (input: string, output: string) => {
            setList([...list, { input, output }]);
        });
    }, [list]);

    return (
        <div className="history">
            <div className="history-header">
                <h1>History</h1>
            </div>
            <div className="history-main" id="history-list">
                {
                    list.map((item, index) => <HistoryItem {...item} key={index}/>)
                }
            </div>
        </div>
    );
}

export default History;
