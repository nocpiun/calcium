/* eslint-disable no-restricted-globals */
import Render from "@/renderer/Render";
import { Theme } from "@/types";

const ctx: Worker = self as any;

let renderer: Render;
let rafTimer: number;
let req: any;

ctx.addEventListener("message", (e) => {
    req = e.data;

    switch(req.type) {
        case "init":
            var canvasCtx = req.canvas.getContext("2d");
            renderer = new Render(req.canvas, canvasCtx, req.ratio, ctx, req.isMobile, req.isDarkMode, req.axis);
            init(canvasCtx, req.ratio);
            break;
        case "reset":
            reset();
            break;
        case "add-function":
            renderer.registerFunction(req.rawText, req.id, req.mode);
            break;
        case "remove-function":
            renderer.unregisterFunction(req.index);
            break;
        case "clear-function":
            renderer.unregisterAllFunctions();
            break;
        case "set-function":
            renderer.editFunction(req.index, req.rawText, req.mode);
            break;
        case "play-function":
            renderer.playFunction(req.index);
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
        case "wheel":
            renderer.handleWheel(req.dy);
            break;
        case "touch-zoom":
            renderer.handleTouchZoom(req.rect, req.cxA, req.cyA, req.cxB, req.cyB);
            break;
        case "theme-change":
            req.isDarkMode
            ? renderer.config.setTheme(Theme.DARK)
            : renderer.config.setTheme(Theme.LIGHT);
            break;
        case "axis-type-change":
            renderer.config.setAxisType(req.axis);
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
