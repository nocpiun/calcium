import React from "react";
import { ReactSVG } from "react-svg";

import type { PropsWithChildren } from "@/types";

import BackIcon from "@/icons/back.svg";

interface IndialogPageProps extends PropsWithChildren {
    title: string
    visible: boolean
    onBack?: () => void
}

const IndialogPage: React.FC<IndialogPageProps> = (props) => {
    const handleBack = () => {
        if(props.onBack) props.onBack();
    };

    return (
        <div className={"indialog-page"+ (props.visible ? " on" : "")}>
            <div className="indialog-page-header">
                <button className="back-button" onClick={() => handleBack()}>
                    <ReactSVG src={BackIcon}/>
                    <span>返回</span>
                </button>
                <h2>{props.title}</h2>
            </div>
            <div className="indialog-page-content">
                {props.children}
            </div>
        </div>
    );
}

export default IndialogPage;
