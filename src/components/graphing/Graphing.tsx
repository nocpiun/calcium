/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";

// import ListItem from "./ListItem";

import Render from "./Render";
import Utils from "../../utils/Utils";

const Graphing: React.FC = () => {
    useEffect(() => {
        const canvas = Utils.getElem<HTMLCanvasElement>("graphing");
        const ctx = canvas.getContext("2d");
        if(!ctx) return;

        // Init size
        canvas.width = Utils.getElem("display-frame").clientWidth;
        canvas.height = Utils.getElem("display-frame").clientHeight;

        // Init ratio
        const ratio = Utils.getPixelRatio(ctx);
        canvas.width *= ratio;
        canvas.height *= ratio;

        // Init renderer
        var renderer = new Render(canvas, ctx);

        // Init timer
        function render() {
            renderer.render();
            window.requestAnimationFrame(render);
        }
        window.requestAnimationFrame(render);
    }, []);

    return (
        <>
            <div className="function-input-container">
                <div className="function-list">

                </div>
            </div>
            
            <div className="graphing-container" id="display-frame">
                <canvas className="graphing-canvas" id="graphing"/>
            </div>
        </>
    );
}

export default Graphing;
