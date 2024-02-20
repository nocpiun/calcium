/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
    useState,
    useEffect,
    useRef,
    useReducer
} from "react";
import { useContextMenu, ContextMenuItem } from "use-context-menu";

import SidebarPage from "@/components/sidebar/SidebarPage";
import HistoryItem from "@/components/sidebar/HistoryItem";

import Emitter from "@/utils/Emitter";
import Utils from "@/utils/Utils";
import { NumberSys, RecordType, RollbackToward } from "@/types";

import IdReducer from "@/reducers/IdReducer";

export interface HistoryItemInfo {
    id: number
    input: string
    output: string
    type: RecordType
    numberSys: NumberSys
}

const History: React.FC = () => {
    const [list, setList] = useState<HistoryItemInfo[]>([]);
    const [rollbackIndex, setRollbackIndex] = useState<number>(0);
    const [unusedId, dispatchId] = useReducer(IdReducer, { id: 0 });
    const listElemRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        Utils.scrollToEnd("history-list", 1, 0);

        new Emitter().once("add-record", (input: string, output: string, type: RecordType, numberSys: NumberSys) => {
            setList((currentList) => {
                var newArr = [...currentList, { id: unusedId.id, input, output, type, numberSys }];
                dispatchId({ type: "refresh", payload: 1 });

                return newArr;
            });
        });

        new Emitter().once("clear-record", () => {
            setList(() => []);
        });
    }, [unusedId.id]);

    /**
     * `remove-record` event has to be apart from other events
     * becuase there's a dependency of the history list with it.
     * If it is together with other events, the dependency will
     * affect the others.
     * 
     * Also, `remove-record` event doesn't use the callback
     * version of `setState` because this doesn't work at all.
     */
    useEffect(() => {
        new Emitter().once("remove-record", (id: number) => {
            var newArr = [...list];

            for(let i = 0; i < newArr.length; i++) {
                if(newArr[i].id === id) {
                    newArr = Utils.arrayRemove(newArr, i);
                    break;
                }
            }

            setList(newArr);
        });
    }, [list]);

    useEffect(() => {
        Utils.scrollToEnd("history-body", 1, 0);
        setRollbackIndex(list.length - 1);
    }, [list]);

    useEffect(() => {
        new Emitter().on("input-last-result", async () => {
            const currentList = await Utils.getCurrentState(setList);
            new Emitter().emit("set-content", currentList[currentList.length - 1].output.split("").join(" "));
        });

        new Emitter().on("record-rollback", async (toward: RollbackToward) => {
            const currentList = await Utils.getCurrentState(setList);
            const currentRollbackIndex = await Utils.getCurrentState(setRollbackIndex);
            if(currentList.length === 0) return;
            const record = currentList[currentRollbackIndex + toward];

            if(
                (
                    toward === RollbackToward.PREV &&
                    currentRollbackIndex > 0
                ) ||
                (
                    toward === RollbackToward.NEXT &&
                    currentRollbackIndex < currentList.length - 1
                )
            ) {
                setRollbackIndex(currentRollbackIndex + toward);
                new Emitter().emit("set-content", record.input, record.output);
            }
        });
    }, []);

    const { contextMenu, onContextMenu } = useContextMenu(
        <>
            <ContextMenuItem onSelect={() => new Emitter().emit("clear-record")}>清空历史</ContextMenuItem>
        </>
    );

    return (
        <>
            <SidebarPage
                id="history"
                title="历史记录"
                tip={<><kbd>ctrl+d</kbd> 清空记录</>}
                onContextMenu={onContextMenu}>
                <div className="history-main" id="history-list" ref={listElemRef}>
                    {
                        list.map((item, index) => <HistoryItem {...item} key={index}/>)
                    }
                </div>
            </SidebarPage>
            {contextMenu}
        </>
    );
}

export default History;
