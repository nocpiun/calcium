import React from "react";
import { ReactSVG } from "react-svg";

import Utils from "@/utils/Utils";
import Emitter from "@/utils/Emitter";

import listIcon from "@/icons/list.svg";

const SidebarOpener: React.FC = () => {
    const handleOpenSidebar = () => {
        if(!Utils.isMobile()) return;

        new Emitter().emit("sidebar-state-change");
    };

    return (
        <div className="mobile-open-sidebar" onClick={() => handleOpenSidebar()}>
            <ReactSVG src={listIcon}/>
        </div>
    );
}

export default SidebarOpener;
