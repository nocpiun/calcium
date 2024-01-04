/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, useMemo, useId } from "react";

import Utils from "@/utils/Utils";

interface SashProps {
    direction: "vertical" | "horizontal"
    defaultValue: number
    minValue?: number
    maxValue?: number
    side: "left" | "right" | "top" | "bottom"
    disabled?: boolean
    onChange?: (value: number) => void
}

const Sash: React.FC<SashProps> = (props) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isMoving, setIsMoving] = useState<boolean>(false);
    const id = useRef(useId());
    const timer = useRef<NodeJS.Timeout | null>();
    const cursorType = useMemo(
        () => !props.disabled ? (props.direction === "vertical" ? "ew-resize" : "ns-resize") : "default",
        [props.direction, props.disabled]
    );

    const handleMouseOver = () => {
        if(props.disabled || timer.current) return;

        timer.current = setTimeout(() => {
            setIsHovered(true);
        }, 500);
    };

    const handleMouseOut = () => {
        if(props.disabled || isMoving) return;
        
        setIsHovered(false);
        clearTimeout(timer.current ?? 0);
        timer.current = null;
    };

    const handleMouseDown = () => {
        if(props.disabled) return;

        setIsHovered(true);
        setIsMoving(true);
    };

    useEffect(() => {
        window.addEventListener("mousemove", async (e: MouseEvent) => {
            if(props.disabled || !(await Utils.getCurrentState(setIsMoving))) return;

            var newValue = props.direction === "vertical" ? e.clientX : e.clientY;
            if(
                props.minValue &&
                props.minValue >= newValue
            ) newValue = props.minValue;
            if(
                props.maxValue &&
                props.maxValue <= newValue
            ) newValue = props.maxValue;

            const elem = Utils.getElem("sash--"+ id.current);
            elem.style[props.side] = (newValue - 2) +"px";
            // Do a repaint so that the update of page will
            // be able to keep up with the update of CSS.
            // Thanks to ChatGPT....
            elem.style.display = "none";
            elem.offsetHeight; // trigger a repaint
            elem.style.display = "";
            
            if(props.onChange) props.onChange(newValue);
        });
        window.addEventListener("mouseup", (e) => {
            if(props.disabled || (e.target as HTMLElement).id !== "sash--"+ id.current) setIsHovered(false);
            setIsMoving(false);
        });
    }, []);

    useEffect(() => {
        Utils.getElem("sash--"+ id.current).style[props.side] = (props.defaultValue - 2) +"px";
    }, [props.disabled]);

    return <div
        className={"sash "+ props.direction + (isHovered ? " hover" : "")}
        id={"sash--"+ id.current}
        style={{
            [props.side]: props.defaultValue - 2,
            cursor: cursorType
        }}
        onMouseOver={() => handleMouseOver()}
        onMouseOut={() => handleMouseOut()}
        onMouseDown={() => handleMouseDown()}/>;
}

export default Sash;
