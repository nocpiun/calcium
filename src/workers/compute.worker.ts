/* eslint-disable no-restricted-globals */
// import { WorkerRequest } from "../types";
// import Compiler from "../utils/Compiler";

const ctx: Worker = self as any;

ctx.addEventListener("message", (e) => {
    // var { rawText, scale, spacing, center, canvasWidth } = e.data as WorkerRequest;
    // var pointsArray = [];

    // var unitPx = scale * spacing;

    // var beginX = -center.x / unitPx;
    // var endX = (canvasWidth - center.x) / unitPx;

    // for(let x1 = beginX; x1 <= endX; x1 += .01) {
    //     var y1 = parseFloat(new Compiler(rawText.split(" "), new Map([["x", x1.toString()]])).run());

    //     var x2 = x1 + .01;
    //     var y2 = parseFloat(new Compiler(rawText.split(" "), new Map([["x", x2.toString()]])).run());

    //     pointsArray.push({ x1, y1, x2, y2 });
    // }

    // ctx.postMessage(pointsArray);
});
