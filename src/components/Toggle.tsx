import React, { useState } from "react";

interface ToggleProps {
    tooltip?: string
    defaultValue?: boolean
    onChange?: (isActive: boolean) => void
}

const Toggle: React.FC<ToggleProps> = (props) => {
    const [active, setActive] = useState(props.defaultValue ?? false);

    const handleChange = () => {
        if(props.onChange) props.onChange(!active);
        setActive(!active);
    };

    return (
        <div
            title={props.tooltip}
            className="toggle"
            onClick={() => handleChange()}
            data-active={active}>
            <span className="toggle-bar"></span>
            <span className="toggle-knob" style={{ transform: active ? "translateX(18px)" : "none" }}></span>
        </div>
    );
}

export default Toggle;
