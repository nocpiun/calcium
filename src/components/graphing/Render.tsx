/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable no-self-assign */
import Point from "./Point";
import Compiler from "../../compiler";

import List from "../../utils/List";
import Utils from "../../utils/Utils";
import { MouseDirection, ZoomDirection } from "../../types";

const colors = {
    primary: "#cbd0df",
    secondary: "#8c949e",
    highlight: "#fff"
};

const delta: number = .005;

// Inside of Service Worker

export default class Render {
    public canvas: OffscreenCanvas;
    private ctx: OffscreenCanvasRenderingContext2D;
    private workerCtx: Worker;

    public scale: number = 90; // px per unit length
    public spacing: number = 1; // unit length

    private mouseDown: boolean = false;
    private mouseDX: number = 0; // mouse delta x
    private mouseDY: number = 0; // mouse delta y

    private fpsUpdater: NodeJS.Timer;
    private currentFPS: number = 0;
    private lastTime: number = 0; // for FPS calculating

    public center: Point;
    private mousePoint: Point;

    public functionList: List<string> = new List();
    private displayedPoints: [Point, Point][] = []; // [p1, p2]

    public constructor(canvas: OffscreenCanvas, ctx: OffscreenCanvasRenderingContext2D, workerCtx: Worker, isDarkMode: boolean) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.workerCtx = workerCtx;
        this.center = new Point(this.canvas.width / 2, this.canvas.height / 2);
        this.mousePoint = this.center;

        this.fpsUpdater = setInterval(() => this.workerCtx.postMessage({ type: "fps", fps: this.currentFPS }), 1000);

        if(!isDarkMode) {
            colors.primary = "#404041";
            colors.highlight = "#222";
        }
    }

    public reset(): void {
        this.functionList.clear();
        this.displayedPoints = [];
        clearInterval(this.fpsUpdater);
    }

    public handleMouseDown(rect: DOMRect, cx: number, cy: number): void {
        this.mouseDown = true;

        this.refreshMousePoint(rect, cx, cy);
        this.mouseDX = this.mousePoint.x - this.center.x;
        this.mouseDY = this.mousePoint.y - this.center.y;
    }

    public handleMouseMove(rect: DOMRect, cx: number, cy: number, direction: MouseDirection): void {
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

        dy > 0
        ? this.scale -= delta
        : this.scale += delta;

        if(this.scale < 53) this.scale = 53;

        this.zoomFunctionImage(dy > 0 ? ZoomDirection.ZOOM_OUT : ZoomDirection.ZOOM_IN);
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
        this.drawStraightLine(this.center.y, colors.primary, 2);
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
            this.drawStraightLine(y1, colors.secondary);
            this.drawStraightLine(y2, colors.secondary);

            // number of the line
            this.drawText((i * this.spacing).toString(), this.center.x + 5, y1 + 5, colors.primary, 15);
            this.drawText((-i * this.spacing).toString(), this.center.x + 5, y2 + 5, colors.primary, 15);
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
            this.drawStraightLine(y1, colors.secondary, .3);
            this.drawStraightLine(y2, colors.secondary, .3);
        }

        /**
         * Y Direction
         */
        // Y Axis
        this.drawVerticalLine(this.center.x, colors.primary, 2);
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
            this.drawVerticalLine(x1, colors.secondary);
            this.drawVerticalLine(x2, colors.secondary);

            // number of the line
            this.drawText((-k * this.spacing).toString(), x1 - 5, this.center.y + 15, colors.primary, 15);
            this.drawText((k * this.spacing).toString(), x2 - 5, this.center.y + 15, colors.primary, 15);
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
            this.drawVerticalLine(x1, colors.secondary, .3);
            this.drawVerticalLine(x2, colors.secondary, .3);
        }
    }

    private moveFunctionImage(direction: MouseDirection): void {
        if(this.displayedPoints.length === 0) return;

        var unitPx = this.scale * this.spacing;
        var oldBegin = this.displayedPoints[0][0].x,
            newBegin = -this.center.x / unitPx,
            oldEnd = this.displayedPoints[this.displayedPoints.length - 1][0].x,
            newEnd = (this.canvas.width - this.center.x) / unitPx;
        var beginX1 = NaN, endX1 = NaN, beginX2 = NaN, endX2 = NaN;

        if(direction === MouseDirection.LEFT) {
            beginX1 = oldBegin;
            endX1 = newBegin;
            beginX2 = oldEnd;
            endX2 = newEnd;
        } else {
            beginX1 = newEnd;
            endX1 = oldEnd;
            beginX2 = newBegin;
            endX2 = oldBegin;
        }

        // Delete out-screen points
        for(let i = 0; i < this.displayedPoints.length; i++) {
            var coordinatePoint = this.displayedPoints[i][0];
            
            if(beginX1 <= coordinatePoint.x && coordinatePoint.x <= endX1) {
                direction === MouseDirection.RIGHT
                ? this.displayedPoints = Utils.arrayRemove(this.displayedPoints, i)
                : this.displayedPoints.shift();
                i--;
            }
        }

        // Add newly in-screen points
        for(let i = 0; i < this.functionList.length; i++) {
            var rawText = this.functionList.get(i);

            if(direction === MouseDirection.LEFT) {
                for(let x1 = beginX2; x1 <= endX2; x1 += delta) {
                    var y1 = parseFloat(new Compiler(rawText.split(" "), new Map([["x", x1.toString()]])).compile());
    
                    var x2 = x1 + delta;
                    var y2 = parseFloat(new Compiler(rawText.split(" "), new Map([["x", x2.toString()]])).compile());
    
                    this.displayedPoints.push([new Point(x1, y1), new Point(x2, y2)]);
                }
            } else {
                for(let x1 = endX2; x1 >= beginX2; x1 -= delta) {
                    var y1 = parseFloat(new Compiler(rawText.split(" "), new Map([["x", x1.toString()]])).compile());
    
                    var x2 = x1 + delta;
                    var y2 = parseFloat(new Compiler(rawText.split(" "), new Map([["x", x2.toString()]])).compile());
    
                    this.displayedPoints.unshift([new Point(x1, y1), new Point(x2, y2)]);
                }
            }
        }
    }

    private zoomFunctionImage(direction: ZoomDirection) {
        var unitPx = this.scale * this.spacing;
        var oldBegin = this.displayedPoints[0][0].x,
            newBegin = -this.center.x / unitPx,
            oldEnd = this.displayedPoints[this.displayedPoints.length - 1][0].x,
            newEnd = (this.canvas.width - this.center.x) / unitPx;

        if(direction === ZoomDirection.ZOOM_IN) {
            for(let i = 0; i < this.displayedPoints.length; i++) {
                var coordinatePoint = this.displayedPoints[i][0];
                
                if(
                    (oldBegin <= coordinatePoint.x && coordinatePoint.x <= newBegin) ||
                    (newEnd <= coordinatePoint.x && coordinatePoint.x <= oldEnd)
                ) {
                    this.displayedPoints = Utils.arrayRemove(this.displayedPoints, i)
                    i--;
                }
            }
        } else {
            for(let i = 0; i < this.functionList.length; i++) {
                var rawText = this.functionList.get(i);

                for(let x1 = oldBegin; x1 >= newBegin; x1 -= delta) {
                    var y1 = parseFloat(new Compiler(rawText.split(" "), new Map([["x", x1.toString()]])).compile());
    
                    var x2 = x1 + delta;
                    var y2 = parseFloat(new Compiler(rawText.split(" "), new Map([["x", x2.toString()]])).compile());
    
                    this.displayedPoints.unshift([new Point(x1, y1), new Point(x2, y2)]);
                }
                for(let x1 = oldEnd; x1 <= newEnd; x1 += delta) {
                    var y1 = parseFloat(new Compiler(rawText.split(" "), new Map([["x", x1.toString()]])).compile());
    
                    var x2 = x1 + delta;
                    var y2 = parseFloat(new Compiler(rawText.split(" "), new Map([["x", x2.toString()]])).compile());
    
                    this.displayedPoints.push([new Point(x1, y1), new Point(x2, y2)]);
                }
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

    private drawCompleteFunction(rawText: string): void {
        var unitPx = this.scale * this.spacing;

        var beginX = -this.center.x / unitPx;
        var endX = (this.canvas.width - this.center.x) / unitPx;

        for(let x1 = beginX; x1 <= endX; x1 += delta) {
            var y1 = parseFloat(new Compiler(rawText.split(" "), new Map([["x", x1.toString()]])).compile());

            var x2 = x1 + delta;
            var y2 = parseFloat(new Compiler(rawText.split(" "), new Map([["x", x2.toString()]])).compile());

            this.displayedPoints.push([new Point(x1, y1), new Point(x2, y2)]);
        }
    }

    private fullyRefreshFunctions(): void {
        this.displayedPoints = [];

        var unitPx = this.scale * this.spacing;

        var beginX = -this.center.x / unitPx;
        var endX = (this.canvas.width - this.center.x) / unitPx;

        this.functionList.forEach((rawText: string) => {
            for(let x1 = beginX; x1 <= endX; x1 += delta) {
                var y1 = parseFloat(new Compiler(rawText.split(" "), new Map([["x", x1.toString()]])).compile());
    
                var x2 = x1 + delta;
                var y2 = parseFloat(new Compiler(rawText.split(" "), new Map([["x", x2.toString()]])).compile());
    
                this.displayedPoints.push([new Point(x1, y1), new Point(x2, y2)]);
            }
        });
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
        this.drawText("O", this.center.x - 20, this.center.y + 20, colors.primary, 17);

        // Mouse point
        var mouseCoordinatesPoint = this.screenToCoordinates(this.mousePoint);
        this.drawText("("+ mouseCoordinatesPoint.x.toFixed(2) +", "+ mouseCoordinatesPoint.y.toFixed(2) +")", 30, 30, colors.primary, 15);
        
        // Is mouse down
        this.drawText(this.mouseDown ? "Moving" : "", this.canvas.width - 80, 30, colors.primary, 15);

        // Draw function images
        for(let i = 0; i < this.displayedPoints.length; i++) {
            this.drawLine(this.coordinatesToScreen(this.displayedPoints[i][0]), this.coordinatesToScreen(this.displayedPoints[i][1]), colors.highlight);
        }

        var imageBitmap = this.canvas.transferToImageBitmap();
        this.workerCtx.postMessage({ type: "render", imageBitmap }, [imageBitmap]);
    }

    public registerFunction(rawText: string): void {
        this.functionList.add(rawText);
        this.drawCompleteFunction(rawText);
    }

    public unregisterFunction(index: number): void {
        this.functionList.remove(index);
        this.fullyRefreshFunctions();
    }
}
