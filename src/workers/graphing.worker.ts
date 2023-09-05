/* eslint-disable no-restricted-globals */
import Render from "@/workers/Render";

const ctx: Worker = self as any;

let renderer: Render;
let rafTimer: number;
let req: any;

ctx.addEventListener("message", (e) => {
    req = e.data;

    switch(req.type) {
        case "init":
            var canvasCtx = req.canvas.getContext("2d");
            renderer = new Render(req.canvas, canvasCtx, req.ratio, ctx, req.isDarkMode, req.isMobile);
            init(canvasCtx, req.ratio);
            break;
        case "reset":
            reset();
            break;
        case "add-function":
            renderer.registerFunction(req.rawText);
            break;
        case "remove-function":
            renderer.unregisterFunction(req.index);
            break;
        case "clear-function":
            renderer.functionList.forEach((func, index) => renderer.unregisterFunction(index));
            renderer.functionList.clear();
            break;
        case "play-function":
            renderer.play(req.index);
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
        case "theme-change":
            req.isDarkMode
            ? Render.changeToDark()
            : Render.changeToLight()
            break;
    }
});

function init(ctx: CanvasRenderingContext2D, ratio: number) {
    // Init ratio
    ctx.scale(ratio, ratio);

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

export default Object.assign({}); // To avoid the annoying type warning
