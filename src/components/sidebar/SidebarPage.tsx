import React, { ReactElement } from "react";

import { PropsWithChildren } from "../../types";

interface SidebarPageProps extends PropsWithChildren {
    id: string
    title: string
    tip?: ReactElement
}

const SidebarPage: React.FC<SidebarPageProps> = (props) => {
    return (
        <div className="sidebar-page" id={props.id}>
            <div className="sidebar-page-header">
                <h1>{props.title}</h1>
                <span className="tip">{props.tip}</span>
            </div>
            <div className="sidebar-page-body" id={props.id +"-body" /* for `scrollToEnd()` */}>
                {props.children}
            </div>
        </div>
    );
}

export default SidebarPage;
