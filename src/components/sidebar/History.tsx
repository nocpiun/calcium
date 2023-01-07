import React, { useState, useEffect } from "react";

import HistoryItem from "./HistoryItem";
import Emitter from "../../utils/Emitter";

interface HistoryItemInfo {
    input: string
    output: string
}

const History: React.FC = () => {
    const [list, setList] = useState<HistoryItemInfo[]>([]);

    useEffect(() => {
        Emitter.get().once("add-record", (input: string, output: string) => {
            if(input.length > 45) input = input.substring(0, 45) +"...";
            if(output.length > 20) output = output.substring(0, 20) +"...";

            setList([...list, { input, output }]);
        });
    }, [list]);

    return (
        <div className="history">
            <div className="history-header">
                <h1>History</h1>
            </div>
            <div className="history-main">
                {
                    list.map((item, index) => <HistoryItem {...item} key={index}/>)
                }
            </div>
        </div>
    );
}

export default History;
