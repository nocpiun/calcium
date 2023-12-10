/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable no-self-assign */
import Point from "@/renderer/Point";
import Function from "@/renderer/Function";
import RootToken from "@/compiler/token/RootToken";

import List from "@/utils/List";
import Collection from "@/utils/Collection";
import { MovingDirection, ZoomDirection } from "@/types";

export const delta: number = .01;
const initialScale = 90;

export default class Render {
    public static colors = {
        primary: "#cbd0df",
        secondary: "#8c949e",
        highlight: "#fff"
    };

    public canvas: OffscreenCanvas;
    private ctx: OffscreenCanvasRenderingContext2D;
    private ratio: number;
    private workerCtx: Worker;
    private calculatingWorker: Worker = new Worker(new URL("@/workers/calculating.worker.ts", import.meta.url));

    public scale: number = initialScale; // px per unit length
    public spacing: number = 1; // unit length

    private mouseDown: boolean = false;
    private mouseDX: number = 0; // mouse delta x
    private mouseDY: number = 0; // mouse delta y

    private fpsUpdater: NodeJS.Timer;
    private currentFPS: number = 0;
    private lastTime: number = 0; // for FPS calculating

    public center: Point;
    private mousePoint: Point;

    public functionList: List<Function> = new List();
    private displayedPoints: Collection<Point> = new Collection();

    private isMobile: boolean;

    public constructor(
        canvas: OffscreenCanvas,
        ctx: OffscreenCanvasRenderingContext2D,
        ratio: number,
        workerCtx: Worker,
        isDarkMode: boolean,
        isMobile: boolean
    ) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.ratio = ratio;
        this.scale *= this.ratio;
        this.workerCtx = workerCtx;
        this.center = this.createPoint(this.canvas.width / 2, this.canvas.height / 2);
        this.mousePoint = this.center;

        // FPS
        this.fpsUpdater = setInterval(() => this.workerCtx.postMessage({ type: "fps", fps: this.currentFPS }), 1000);

        // Worker listener
        this.calculatingWorker.addEventListener("message", (e) => this.handleCalculatingWorkerMessaging(e));

        // Appearance
        this.isMobile = isMobile;
        if(!isDarkMode) Render.changeToDark();
    }

    public static changeToDark(): void {
        Render.colors.primary = "#404041";
        Render.colors.highlight = "#222";
    }

    public static changeToLight(): void {
        Render.colors.primary = "#cbd0df";
        Render.colors.highlight = "#fff";
    }

    /**
     * Messaging between rendering thread and calculating thread
     * 
     * Rendering thread: @/workers/graphing.worker.ts
     * Calculating thread: @/workers/calculating.worker.ts
     */
    private handleCalculatingWorkerMessaging(e: MessageEvent): void {
        const res = e.data;

        switch(res.type) {
            case "compile":
                this.functionList.add(new Function(res.id, RootToken.create(e.data.root)));
                this.drawCompleteFunction();
                break;
            case "evaluate":
                switch(res.operate) {
                    case "add":
                        this.displayedPoints.add(this.createPoint(res.x, res.y));
                        break;
                    case "unshift":
                        this.displayedPoints.unshift(this.createPoint(res.x, res.y));
                        break;
                }
                break;
        }
    }

    public createPoint(x: number, y: number): Point {
        return new Point(this, x, y);
    }

    public reset(): void {
        this.functionList.clear();
        this.displayedPoints.clear();
        clearInterval(this.fpsUpdater);
    }

    public handleMouseDown(rect: DOMRect, cx: number, cy: number): void {
        this.mouseDown = true;

        cx *= this.ratio;
        cy *= this.ratio;

        this.refreshMousePoint(rect, cx, cy);
        this.mouseDX = this.mousePoint.x - this.center.x;
        this.mouseDY = this.mousePoint.y - this.center.y;
    }

    public handleMouseMove(rect: DOMRect, cx: number, cy: number, direction: MovingDirection): void {
        cx *= this.ratio;
        cy *= this.ratio;

        this.refreshMousePoint(rect, cx, cy);

        if(!this.mouseDown) return;

        this.center.x = this.mousePoint.x - this.mouseDX;
        this.center.y = this.mousePoint.y - this.mouseDY;

        this.moveFunctionImage(direction);
    }

    public handleMouseUp(): void {
        this.stopMoving();
    }

    public handleMouseLeave(): void {
        this.stopMoving();
        this.mousePoint = this.center;
    }

    public handleWheel(dy: number): void {
        const delta = 7;
        const mouseOriginPoint = this.mousePoint.toCoordinates();

        dy > 0
        ? this.scale -= delta / this.spacing
        : this.scale += delta / this.spacing;

        if(this.scale * this.spacing <= 66) {
            this.spacing === 2
            ? this.spacing = 5
            : this.spacing *= 2;
        } else if(this.scale * this.spacing >= 138) {
            this.spacing === 5
            ? this.spacing = 2
            : this.spacing /= 2;
        }

        this.zoomFunctionImage(dy > 0 ? ZoomDirection.ZOOM_OUT : ZoomDirection.ZOOM_IN);

        const mouseCurrentPoint = this.mousePoint.toCoordinates();
        var centerDx = mouseCurrentPoint.x - mouseOriginPoint.x,
            centerDy = mouseCurrentPoint.y - mouseOriginPoint.y;
        
        this.center.x += centerDx * this.scale;
        this.center.y -= centerDy * this.scale;
    }

    private refreshMousePoint(rect: DOMRect, cx: number, cy: number): void {
        var mousePoint = this.createPoint(cx - rect.left, cy - rect.top);
        this.mousePoint = mousePoint;
    }

    private refreshAxisLine(): void {
        var unitPx = this.spacing * this.scale;
        var secondaryUnitPx = (this.spacing / 5) * this.scale;
        /**
         * X Direction
         */
        // X Axis
        this.drawStraightLine(this.center.y, Render.colors.primary, 2);
        // thicker line
        for(
            let i = 1;
            (
                this.center.y - i * unitPx >= 0 ||
                this.center.y + i * unitPx <= this.canvas.height
            );
            i++
        ) {
            var y1 = this.center.y - i * unitPx;
            var y2 = this.center.y + i * unitPx;
            this.drawStraightLine(y1, Render.colors.secondary);
            this.drawStraightLine(y2, Render.colors.secondary);

            // number of the line
            this.drawText((i * this.spacing).toString(), this.center.x - (this.getTextWidth((i * this.spacing).toString()) + 5) * this.ratio, y1 + 5 * this.ratio, Render.colors.primary, 15);
            this.drawText((-i * this.spacing).toString(), this.center.x - (this.getTextWidth((-i * this.spacing).toString()) + 5) * this.ratio, y2 + 5 * this.ratio, Render.colors.primary, 15);
        }
        // thinner line
        for(
            let i = 1;
            (
                this.center.y - i * secondaryUnitPx >= 0 ||
                this.center.y + i * secondaryUnitPx <= this.canvas.height
            );
            i++
        ) {
            var y1 = this.center.y - i * secondaryUnitPx;
            var y2 = this.center.y + i * secondaryUnitPx;
            this.drawStraightLine(y1, Render.colors.secondary, .3);
            this.drawStraightLine(y2, Render.colors.secondary, .3);
        }

        /**
         * Y Direction
         */
        // Y Axis
        this.drawVerticalLine(this.center.x, Render.colors.primary, 2);
        // thicker line
        for(
            let k = 1;
            (
                this.center.x - k * unitPx >= 0 ||
                this.center.x + k * unitPx <= this.canvas.width
            );
            k++
        ) {
            var x1 = this.center.x - k * unitPx;
            var x2 = this.center.x + k * unitPx;
            this.drawVerticalLine(x1, Render.colors.secondary);
            this.drawVerticalLine(x2, Render.colors.secondary);

            // number of the line
            this.drawText((-k * this.spacing).toString(), x1 - (this.getTextWidth((-k * this.spacing).toString()) / 2) * this.ratio, this.center.y + 15 * this.ratio, Render.colors.primary, 15);
            this.drawText((k * this.spacing).toString(), x2 - (this.getTextWidth((k * this.spacing).toString()) / 2) * this.ratio, this.center.y + 15 * this.ratio, Render.colors.primary, 15);
        }
        // thinner line
        for(
            let l = 1;
            (
                this.center.x - l * secondaryUnitPx >= 0 ||
                this.center.x + l * secondaryUnitPx <= this.canvas.width
            );
            l++
        ) {
            var x1 = this.center.x - l * secondaryUnitPx;
            var x2 = this.center.x + l * secondaryUnitPx;
            this.drawVerticalLine(x1, Render.colors.secondary, .3);
            this.drawVerticalLine(x2, Render.colors.secondary, .3);
        }
    }

    private moveFunctionImage(direction: MovingDirection): void {
        if(this.displayedPoints.length === 0) return;

        var unitPx = this.scale;
        var oldBegin = this.displayedPoints.get(0).x,
            newBegin = -this.center.x / unitPx,
            oldEnd = this.displayedPoints.get(this.displayedPoints.length - 1).x,
            newEnd = (this.canvas.width - this.center.x) / unitPx;
        var beginX = NaN, endX = NaN;

        if(direction === MovingDirection.LEFT) {
            beginX = oldEnd;
            endX = newEnd;
        } else {
            beginX = newBegin;
            endX = oldBegin;
        }

        // Add newly in-screen points
        for(let i = 0; i < this.functionList.length; i++) {
            var func = this.functionList.get(i);

            this.calculatePoints(func, beginX, endX, direction);
        }
    }

    private zoomFunctionImage(direction: ZoomDirection): void {
        if(this.displayedPoints.length === 0) return;

        var unitPx = this.scale;
        var oldBegin = this.displayedPoints.get(0).x,
            newBegin = -this.center.x / unitPx,
            oldEnd = this.displayedPoints.get(this.displayedPoints.length - 1).x,
            newEnd = (this.canvas.width - this.center.x) / unitPx;

        if(direction === ZoomDirection.ZOOM_IN) {
            this.displayedPoints.clear();
            
            for(let i = 0; i < this.functionList.length; i++) {
                var func = this.functionList.get(i);

                this.calculatePoints(func, newBegin, newEnd);
            }
        } else {
            for(let i = 0; i < this.functionList.length; i++) {
                var func = this.functionList.get(i);

                this.calculatePoints(func, newBegin, oldBegin, MovingDirection.RIGHT);
                this.calculatePoints(func, oldEnd, newEnd);
            }
        }
    }

    private stopMoving(): void {
        this.mouseDown = false;
        this.mouseDX = 0;
        this.mouseDY = 0;
    }

    private drawLine(begin: Point, end: Point, color: string, width: number = 1): void {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width * this.ratio;
        this.ctx.moveTo(begin.x, begin.y);
        if(!(Math.abs(begin.y - end.y) > this.canvas.height && begin.y * end.y < 0)) {
            this.ctx.lineTo(end.x, end.y);
        }
        this.ctx.stroke();
        this.ctx.closePath();
    }

    private drawPoint(point: Point, color: string): void {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.fillRect(point.x, point.y, 2, 2);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    private drawStraightLine(y: number, color: string, width: number = 1): void {
        this.drawLine(this.createPoint(0, y), this.createPoint(this.canvas.width, y), color, width);
    }

    private drawVerticalLine(x: number, color: string, width: number = 1): void {
        this.drawLine(this.createPoint(x, 0), this.createPoint(x, this.canvas.height), color, width);
    }

    private drawText(text: string, x: number, y: number, color: string, fontSize: number = 20): void {
        this.ctx.font = (fontSize * this.ratio) +"px Ubuntu-Regular";
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y);
    }

    private drawCompleteFunction(): void {
        var func = this.functionList.getLast();

        var unitPx = this.scale;

        var beginX = -this.center.x / unitPx;
        var endX = (this.canvas.width - this.center.x) / unitPx;

        this.calculatePoints(func, beginX, endX);
    }

    private fullyRefreshFunctions(): void {
        this.displayedPoints.clear();

        var unitPx = this.scale;

        var beginX = -this.center.x / unitPx;
        var endX = (this.canvas.width - this.center.x) / unitPx;

        this.functionList.forEach((func) => this.calculatePoints(func, beginX, endX));
    }

    private clear(): void {
        this.canvas.width = this.canvas.width;
        this.canvas.height = this.canvas.height;
    }

    private updateFPS(): void {
        const now = (+new Date());
        var fps = 1000 / (now - this.lastTime);
        this.lastTime = now;

        this.currentFPS = fps;
    }

    // To render each frame
    public render(): void {
        this.updateFPS();
        this.clear();

        this.refreshAxisLine();

        // O point
        this.drawText("O", this.center.x - 20 * this.ratio, this.center.y + 20 * this.ratio, Render.colors.primary, 17);

        // Mouse point
        var mouseCoordinatesPoint = this.mousePoint.toCoordinates();
        this.drawText("("+ mouseCoordinatesPoint.x.toFixed(2) +", "+ mouseCoordinatesPoint.y.toFixed(2) +")", (!this.isMobile ? 30 : 50) * this.ratio, 30 * this.ratio, Render.colors.primary, 15);
        
        // Is mouse down
        this.drawText(this.mouseDown ? "Moving" : "", this.canvas.width - 80 * this.ratio, 30 * this.ratio, Render.colors.primary, 15);

        // Draw function images
        for(let i = 0; i < this.displayedPoints.length; i++) {
            this.drawPoint(this.displayedPoints.get(i).toScreen(), Render.colors.highlight);
        }

        var imageBitmap = this.canvas.transferToImageBitmap();
        this.workerCtx.postMessage({ type: "render", imageBitmap }, [imageBitmap]);
    }

    public registerFunction(rawText: string, id: number): void {
        this.calculatingWorker.postMessage({ type: "compile", rawText, id });
    }

    public unregisterFunction(index: number): void {
        this.functionList.remove(index);
        this.fullyRefreshFunctions();
    }

    public getTextWidth(text: string): number {
        return this.ctx.measureText(text).width;
    }

    public async calculatePoints(func: Function, beginX: number, endX: number, direction: MovingDirection = MovingDirection.LEFT): Promise<void> {
        if(direction === MovingDirection.LEFT) {
            for(let x = beginX; x <= endX; x += delta * this.spacing) {
                // var y = await func.calculate(x);
                // this.displayedPoints.add(this.createPoint(x, y));
                this.calculatingWorker.postMessage({ type: "evaluate", id: func.id, root: func.root, x, operate: "add" });
            }
        } else {
            for(let x = endX; x >= beginX; x -= delta * this.spacing) {
                // var y = await func.calculate(x);
                // this.displayedPoints.unshift(this.createPoint(x, y));
                this.calculatingWorker.postMessage({ type: "evaluate", id: func.id, root: func.root, x, operate: "unshift" });
            }
        }
    }
}
