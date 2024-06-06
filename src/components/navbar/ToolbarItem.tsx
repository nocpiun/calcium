import React from "react";

interface BarItemProps {
    title: string
    onClick?: () => void
    className?: string
}

const ToolbarItem: React.FC<BarItemProps> = (props) => {
    const handleClick = () => {
        if(props.onClick) props.onClick();
    };

    return (
        <div
            className={"toolbar-item"+ (props.className ? " "+ props.className : "")}
            onClick={() => handleClick()}>
            <span>{props.title}</span>
        </div>
    );
}

export default ToolbarItem;
