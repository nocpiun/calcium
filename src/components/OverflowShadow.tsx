import React from "react";

interface OverflowShadowProps {
    width?: number
}

const OverflowShadow: React.FC<OverflowShadowProps> = (props) => {
    return <div
        className="overflow-shadow"
        style={{ width: props.width || 30 }}/>;
}

export default OverflowShadow;
