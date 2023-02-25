/* eslint-disable no-restricted-globals */
import Render from "../components/graphing/Render";
import Utils from "../utils/Utils";
import List from "../utils/List";

const ctx: Worker = self as any;

let renderer: Render;
let rafTimer: number;
let req: any;

ctx.addEventListener("message", (e) => {
    req = e.data;

    switch(req.type) {
        case "init":
            renderer = new Render(req.canvas, req.canvas.getContext("2d"), ctx, req.isDarkMode);
            init(req.canvas);
            break;
        case "reset":
            reset();
            break;
        case "add-function":
            renderer.registerFunction(req.rawText);
            break;
        case "clear-function":
            renderer.functionList = new List();
            break;
        case "mouse-down":
            renderer.handleMouseDown(req.rect, req.cx, req.cy);
            break;
        case "mouse-move":
            renderer.handleMouseMove(req.rect, req.cx, req.cy, req.direction);
            break;
        case "mouse-up":
            renderer.handleMouseUp();
            break;
        case "mouse-leave":
            renderer.handleMouseLeave();
            break;
        case "wheel":
            renderer.handleWheel(req.dy);
            break;
    }
});

function init(canvas: OffscreenCanvas) {
    // Init ratio
    const ratio = Utils.getPixelRatio(ctx);
    canvas.width *= ratio;
    canvas.height *= ratio;

    function render() {
        renderer.render();
        rafTimer = self.requestAnimationFrame(render);
    }
    rafTimer = self.requestAnimationFrame(render);
}

function reset() {
    renderer.reset();
    self.cancelAnimationFrame(rafTimer);
}
