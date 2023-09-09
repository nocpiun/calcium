import React, { useId } from "react";
import { Tooltip } from "react-tooltip";

interface BarItemProps {
    title: string
    disabled?: boolean
    onClick?: () => void
    to?: string
    className?: string
    tooltip?: string
}

const BarItem: React.FC<BarItemProps> = (props) => {
    const id = useId();

    const handleClick = () => {
        if(props.to) {
            window.open(props.to, "blank");
            return;
        }
        if(props.onClick) props.onClick();

    };

    return (
        <>
            <div
                className={"bar-item"+ (props.disabled ? " disabled" : "") + (props.className ? " "+ props.className : "")}
                data-tooltip-id={id}
                data-tooltip-content={props.tooltip}
                onClick={() => handleClick()}>
                <span>{props.title}</span>
            </div>

            {
                props.tooltip &&
                <Tooltip
                    id={id}
                    place="top"
                    opacity={1}
                    border="1px solid var(--ca-gray2)"/>
            }
        </>
    );
}

export default BarItem;
