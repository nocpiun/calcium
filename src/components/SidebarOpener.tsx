import React from "react";

import Utils from "../utils/Utils";
import Emitter from "../utils/Emitter";

const SidebarOpener: React.FC = () => {
    const handleOpenSidebar = () => {
        if(!Utils.isMobile()) return;

        Emitter.get().emit("sidebar-state-change");
    };

    return <div className="mobile-open-sidebar" onClick={() => handleOpenSidebar()}/>
}

export default SidebarOpener;
