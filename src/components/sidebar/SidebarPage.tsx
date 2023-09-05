import React, { ReactElement, DOMAttributes } from "react";

import { PropsWithChildren } from "@/types";

interface SidebarPageProps extends PropsWithChildren {
    id: string
    title: string
    tip?: ReactElement
}

const SidebarPage: React.FC<SidebarPageProps & DOMAttributes<HTMLDivElement>> = (props) => {
    const { title, tip, children, ...attrProps } = props;

    return (
        <div className="sidebar-page" {...attrProps}>
            <div className="sidebar-page-header">
                <h1>{title}</h1>
                <span className="tip">{tip}</span>
            </div>
            <div className="sidebar-page-body" id={props.id +"-body" /* for `scrollToEnd()` */}>
                {children}
            </div>
        </div>
    );
}

export default SidebarPage;
