import React, { useRef, useState, useEffect } from "react";
import relationship from "relationship.js";

import useEmitter from "@/hooks/useEmitter";
import Utils from "@/utils/Utils";

import SeniorityInputButton from "@/views/seniority/SeniorityInputButton";

const inputSplit: string = getComputedStyle(document.body).getPropertyValue("--ca-seniority-split").replaceAll("\"", "");

const SeniorityPage: React.FC = () => {
    const [content, setContent] = useState<string[]>([]);
    const [result, setResult] = useState<string[]>([]);
    const displayContainerRef = useRef<HTMLDivElement>(null);

    const handleWheel = (e: React.WheelEvent) => {
        if(!displayContainerRef.current) return;
        e.stopPropagation();

        displayContainerRef.current.scrollLeft += (e.deltaY > 0 ? 1 : -1) * 50;
    };

    useEffect(() => {
        if(!displayContainerRef.current) return;

        if(content.length === 0) {
            setResult([]);
            return;
        }

        setResult(relationship({ text: content.join(inputSplit) }));
        Utils.scrollToEnd(displayContainerRef.current, 0, 1);
    }, [content]);

    useEmitter([
        ["seniority-input", async (buttonName: string, buttonId: string) => {
            switch(buttonId) {
                case "delete":
                    setContent((current) => current.slice(0, current.length - 1));
                    break;
                case "clear":
                    setContent([]);
                    break;
                default:
                    setContent((current) => [...current, buttonName]);
            }
        }],
        ["seniority-dialog-close", () => {
            setContent([]);
            setResult([]);
        }],
    ]);

    return (
        <>
            <div className="seniority-output">
                <div className="seniority-display-container" onWheel={(e) => handleWheel(e)} ref={displayContainerRef}>
                    <div className="seniority-display">
                        <div className="seniority-symbol first">我</div>
                        {content.map((item, index) => {
                            return <div className="seniority-symbol" key={index}>{item}</div>;
                        })}
                    </div>
                </div>
                <div className="seniority-result">
                    {result.join("/")}
                </div>
            </div>
            <div className="seniority-input">
                <SeniorityInputButton name="爸爸" id="father"/>
                <SeniorityInputButton name="妈妈" id="mother"/>
                <SeniorityInputButton name="哥哥" id="elder-brother"/>
                <SeniorityInputButton name="弟弟" id="brother"/>
                <SeniorityInputButton name="姐姐" id="elder-sister"/>
                <SeniorityInputButton name="妹妹" id="sister"/>
                <SeniorityInputButton name="老公" id="husband"/>
                <SeniorityInputButton name="老婆" id="wife"/>
                <SeniorityInputButton name="儿子" id="son"/>
                <SeniorityInputButton name="女儿" id="daughter"/>
                <SeniorityInputButton name="删除" id="delete"/>
                <SeniorityInputButton name="清空" id="clear"/>
            </div>
        </>
    );
}

export default SeniorityPage;
