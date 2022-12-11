import React from "react";

const Sidebar: React.FC = () => {
    return (
        <aside className="sidebar-container">
            <div className="mode-switcher"></div>
            <div className="history">
                <div className="history-header">
                    <h1>History</h1>
                </div>
                <div className="history-main">

                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
