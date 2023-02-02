/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable no-self-assign */
import Point from "./Point";
import Compiler from "../../compiler";

import List from "../../utils/List";
// import { WorkerResponse } from "../../types";

export default class Render {
    public canvas: OffscreenCanvas;
    private ctx: OffscreenCanvasRenderingContext2D;
    private workerCtx: Worker;
    // private workerPool: WorkerPool = new WorkerPool(window.navigator.hardwareConcurrency || 2);

    public scale: number = 90; // px per unit length
    public spacing: number = 1; // unit length

    private mouseDown: boolean = false;
    private mouseDX: number = 0; // mouse delta x
    private mouseDY: number = 0; // mouse delta y

    public center: Point;
    private mousePoint: Point;

    private functionList: List<string> = new List();
    private displayedPoints: [Point, Point][] = []; // [p1, p2]

    public constructor(canvas: OffscreenCanvas, ctx: OffscreenCanvasRenderingContext2D, workerCtx: Worker) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.workerCtx = workerCtx;
        this.center = new Point(this.canvas.width / 2, this.canvas.height / 2);
        this.mousePoint = this.center;

        // this.initListeners();
    }

    public reset(): void {
        this.functionList.clear();
        this.displayedPoints = [];
        // this.workerPool.terminateAllWorkers();
    }

    // private initListeners(): void {
    //     this.canvasElem.addEventListener("mousedown", (e: MouseEvent) => {
    //         this.mouseDown = true;

    //         this.refreshMousePoint(e);
    //         this.mouseDX = this.mousePoint.x - this.center.x;
    //         this.mouseDY = this.mousePoint.y - this.center.y;
    //     });
    //     this.canvasElem.addEventListener("mousemove", (e: MouseEvent) => {
    //         this.refreshMousePoint(e);

    //         if(!this.mouseDown) return;

    //         this.center.x = this.mousePoint.x - this.mouseDX;
    //         this.center.y = this.mousePoint.y - this.mouseDY;
    //     });
    //     this.canvasElem.addEventListener("mouseup", () => this.stopMoving());
    //     this.canvasElem.addEventListener("mouseleave", () => {
    //         this.stopMoving();
    //         this.mousePoint = this.center;
    //     });

    //     this.canvasElem.addEventListener("wheel", (e: WheelEvent) => {
    //         const delta = 7;

    //         e.deltaY > 0
    //         ? this.scale -= delta
    //         : this.scale += delta;

    //         if(this.scale < 53) this.scale = 53;
    //     });
    // }

    public handleMouseDown(rect: DOMRect, cx: number, cy: number): void {
        this.mouseDown = true;

        this.refreshMousePoint(rect, cx, cy);
        this.mouseDX = this.mousePoint.x - this.center.x;
        this.mouseDY = this.mousePoint.y - this.center.y;
    }

    public handleMouseMove(rect: DOMRect, cx: number, cy: number): void {
        this.refreshMousePoint(rect, cx, cy);

        if(!this.mouseDown) return;

        this.center.x = this.mousePoint.x - this.mouseDX;
        this.center.y = this.mousePoint.y - this.mouseDY;
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

        dy > 0
        ? this.scale -= delta
        : this.scale += delta;

        if(this.scale < 53) this.scale = 53;
    }

    private refreshMousePoint(rect: DOMRect, cx: number, cy: number): void {
        var mousePoint = new Point(cx - rect.left, cy - rect.top);
        this.mousePoint = mousePoint;
    }

    private refreshAxisLine(): void {
        var unitPx = this.spacing * this.scale;
        var secondaryUnitPx = (this.spacing / 5) * this.scale;
        /**
         * X Direction
         */
        // X Axis
        this.drawStraightLine(this.center.y, "#cbd0df", 2);
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
            this.drawStraightLine(y1, "#8c949e");
            this.drawStraightLine(y2, "#8c949e");

            // number of the line
            this.drawText((i * this.spacing).toString(), this.center.x + 5, y1 + 5, "#cbd0df", 15);
            this.drawText((-i * this.spacing).toString(), this.center.x + 5, y2 + 5, "#cbd0df", 15);
        }
        // thinner line
        for(
            let j = 1;
            (
                this.center.y - j * secondaryUnitPx >= 0 ||
                this.center.y + j * secondaryUnitPx <= this.canvas.height
            );
            j++
        ) {
            var y1 = this.center.y - j * secondaryUnitPx;
            var y2 = this.center.y + j * secondaryUnitPx;
            this.drawStraightLine(y1, "#8c949e", .3);
            this.drawStraightLine(y2, "#8c949e", .3);
        }

        /**
         * Y Direction
         */
        // Y Axis
        this.drawVerticalLine(this.center.x, "#cbd0df", 2);
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
            this.drawVerticalLine(x1, "#8c949e");
            this.drawVerticalLine(x2, "#8c949e");

            // number of the line
            this.drawText((-k * this.spacing).toString(), x1 - 5, this.center.y + 15, "#cbd0df", 15);
            this.drawText((k * this.spacing).toString(), x2 - 5, this.center.y + 15, "#cbd0df", 15);
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
            this.drawVerticalLine(x1, "#8c949e", .3);
            this.drawVerticalLine(x2, "#8c949e", .3);
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
        this.ctx.lineWidth = width;
        this.ctx.moveTo(begin.x, begin.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    private drawStraightLine(y: number, color: string, width: number = 1): void {
        this.drawLine(new Point(0, y), new Point(this.canvas.width, y), color, width);
    }

    private drawVerticalLine(x: number, color: string, width: number = 1): void {
        this.drawLine(new Point(x, 0), new Point(x, this.canvas.height), color, width);
    }

    private drawText(text: string, x: number, y: number, color: string, fontSize: number = 20): void {
        this.ctx.font = fontSize +"px Ubuntu-Regular";
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y);
    }

    private clear(): void {
        this.canvas.width = this.canvas.width;
        this.canvas.height = this.canvas.height;
    }

    // Point transforming
    private screenToCoordinates(point: Point): Point {
        var unitPx = this.scale * this.spacing;
        return new Point((point.x - this.center.x) / unitPx, -(point.y - this.center.y) / unitPx);
    }
    private coordinatesToScreen(point: Point): Point {
        var unitPx = this.scale * this.spacing;
        return new Point(this.center.x + (point.x * unitPx), this.center.y - (point.y * unitPx));
    }
    /*****/

    // To render each frame
    public render(): void {
        this.clear();

        this.refreshAxisLine();

        // O point
        this.drawText("O", this.center.x - 20, this.center.y + 20, "#cbd0df", 17);

        // Mouse point
        var mouseCoordinatesPoint = this.screenToCoordinates(this.mousePoint);
        this.drawText("Mouse: "+ mouseCoordinatesPoint.x.toFixed(2) +", "+ mouseCoordinatesPoint.y.toFixed(2), 30, 30, "#cbd0df", 15);

        // Draw function images
        for(let i = 0; i < this.displayedPoints.length; i++) {
            this.drawLine(this.displayedPoints[i][0], this.displayedPoints[i][1], "#fff");
        }
        this.displayedPoints = [];

        // Compute function points
        for(let i = 0; i < this.functionList.length; i++) {
            var rawText = this.functionList.get(i);

            var unitPx = this.scale * this.spacing;

            var beginX = -this.center.x / unitPx;
            var endX = (this.canvas.width - this.center.x) / unitPx;

            this.ctx.beginPath();

            for(let x1 = beginX; x1 <= endX; x1 += .01) {
                var y1 = parseFloat(new Compiler(rawText.split(" "), new Map([["x", x1.toString()]])).compile());

                var x2 = x1 + .01;
                var y2 = parseFloat(new Compiler(rawText.split(" "), new Map([["x", x2.toString()]])).compile());

                var p1 = this.coordinatesToScreen(new Point(x1, y1));
                var p2 = this.coordinatesToScreen(new Point(x2, y2));

                this.ctx.strokeStyle = "#fff";
                this.ctx.lineWidth = 1;
                this.ctx.moveTo(p1.x, p1.y);
                this.ctx.lineTo(p2.x, p2.y);
            }
            
            this.ctx.stroke();
            this.ctx.closePath();
        }

        var imageBitmap = this.canvas.transferToImageBitmap();
        this.workerCtx.postMessage({ imageBitmap }, [imageBitmap]);
    }

    public registerFunction(rawText: string): void {
        this.functionList.add(rawText);
    }
}
