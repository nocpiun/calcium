import React, { useState, useId } from "react";
import { Tooltip } from "react-tooltip";

interface ToggleProps {
    tooltip?: string
    defaultValue?: boolean
    onChange?: (isActive: boolean) => void
}

const Toggle: React.FC<ToggleProps> = (props) => {
    const [active, setActive] = useState(props.defaultValue ?? false);
    const id = useId();

    const handleChange = () => {
        if(props.onChange) props.onChange(!active);
        setActive(!active);
    };

    return (
        <>
            <div
                className="toggle"
                onClick={() => handleChange()}
                data-active={active}
                data-tooltip-id={id}
                data-tooltip-content={props.tooltip}>
                <span className="toggle-bar"></span>
                <span className="toggle-knob" style={{ transform: active ? "translateX(18px)" : "none" }}></span>
            </div>

            {
                props.tooltip &&
                <Tooltip
                    id={id}
                    place="right"
                    opacity={1}
                    border="1px solid var(--ca-gray2)"
                    delayShow={500}/>
            }
        </>
    );
}

export default Toggle;
