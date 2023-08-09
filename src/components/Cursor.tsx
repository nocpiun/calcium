import React, { useEffect, useRef } from "react";

const blinkClassName = "cursor-blink";

const Cursor: React.FC = () => {
    const cursorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        var timer = setInterval(() => {
            if(!cursorRef.current) return;

            cursorRef.current.classList.contains(blinkClassName)
            ? cursorRef.current.classList.remove(blinkClassName)
            : cursorRef.current.classList.add(blinkClassName);
        }, 550);

        return () => clearInterval(timer);
    }, []);

    return <div className={"cursor "+ blinkClassName} ref={cursorRef}/>
}

export default Cursor;
