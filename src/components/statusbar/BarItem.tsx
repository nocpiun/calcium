import React from "react";

interface BarItemProps {
    title: string
    disabled?: boolean
    onClick?: () => void
    to?: string
    className?: string
    tooltip?: string
}

const BarItem: React.FC<BarItemProps> = (props) => {
    const handleClick = () => {
        if(props.to) {
            window.open(props.to, "blank");
            return;
        }
        if(props.onClick) props.onClick();

    };

    return (
        <div
            className={"bar-item"+ (props.disabled ? " disabled" : "") + (props.className ? " "+ props.className : "")}
            title={props.tooltip}
            onClick={() => handleClick()}>
            <span>{props.title}</span>
        </div>
    );
}

export default BarItem;
