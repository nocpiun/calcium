import React, { useEffect } from "react";

import Utils from "../../utils/Utils";

const blinkClassName = "cursor-blink";

const Cursor: React.FC = () => {
    useEffect(() => {
        var cursorElem = Utils.getElem("cursor");

        var timer = setInterval(() => {
            cursorElem.classList.contains(blinkClassName)
            ? cursorElem.classList.remove(blinkClassName)
            : cursorElem.classList.add(blinkClassName);
        }, 550);

        return () => clearInterval(timer);
    });

    return <div className={"cursor "+ blinkClassName} id="cursor"/>
}

export default Cursor;
