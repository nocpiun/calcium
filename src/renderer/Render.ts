/* eslint-disable @typescript-eslint/no-redeclare */
import Graphics, { Axis, Point } from "@/renderer/Graphics";
import Function from "@/renderer/Function";
import RootToken from "@/compiler/token/RootToken";

import List from "@/utils/List";
import Collection from "@/utils/Collection";
import Is from "@/compiler/Is";
import Float from "@/compiler/Float";
import { FunctionInputtingType, MovingDirection, ZoomDirection } from "@/types";

export const delta: number = .01;

export default class Render extends Graphics {
    private calculatingWorker: Worker | null = null;

    private mouseDown: boolean = false;
    private mouseDX: number = 0; // mouse delta x
    private mouseDY: number = 0; // mouse delta y
    private cameraPosition: [number, number]; // [camera begin X, camera end X]

    // Mobile zooming
    private zoomingScale: number | null = null;
    private zoomingFocus: Point | null = null;
    private lastZoomingSize: number | null = null;

    private fpsUpdater: NodeJS.Timer;
    private currentFPS: number = 0;
    private lastTime: number = 0; // for FPS calculating

    public functionList: List<Function> = new List();
    private displayedPoints: Collection<Point> = new Collection();

    public constructor(
        canvas: OffscreenCanvas,
        ctx: OffscreenCanvasRenderingContext2D,
        ratio: number,
        private workerCtx: Worker,
        isMobile: boolean,
        isDarkMode: boolean,
        axis: Axis
    ) {
        super(canvas, ctx, ratio, isMobile, isDarkMode, axis);

        this.center = this.createPoint(this.canvas.width / 2, this.canvas.height / 2);
        this.cameraPosition = [-this.center.x / this.scale, (this.canvas.width - this.center.x) / this.scale];

        // FPS
        this.fpsUpdater = setInterval(() => this.workerCtx.postMessage({ type: "fps", fps: this.currentFPS }), 1000);

        this.resetCalculatingWorker();
    }

    // MARK: Thread Messaging

    private resetCalculatingWorker() {
        this.calculatingWorker?.terminate();
        this.calculatingWorker = new Worker(new URL("@/workers/calculating.worker.ts", import.meta.url));
        this.calculatingWorker.addEventListener("message", (e) => this.handleCalculatingWorkerMessaging(e));
    }

    /**
     * Messaging between rendering thread and calculating thread
     * 
     * Rendering thread: @/workers/graphing.worker.ts
     * Calculating thread: @/workers/calculating.worker.ts
     */
    private handleCalculatingWorkerMessaging(e: MessageEvent) {
        const res = e.data;

        switch(res.type) {
            case "compile":
                this.functionList.add(new Function(res.id, res.mode, RootToken.create(res.root)));
                this.drawCompleteFunction();
                break;
            case "compile-and-set":
                var oldFunction = this.functionList.get(res.index);
                this.functionList.set(res.index, new Function(oldFunction.id, res.mode, RootToken.create(res.root)));
                this.fullyRefreshFunctions();
                break;
            case "evaluate":
                switch(res.operate) {
                    case "add":
                        res.mode === FunctionInputtingType.NORMAL
                        ? this.displayedPoints.add(this.createPoint(res.x, res.y))
                        : this.displayedPoints.add(this.createPoint(res.y * Math.cos(res.x), res.y * Math.sin(res.x)));
                        break;
                    case "unshift":
                        res.mode === FunctionInputtingType.NORMAL
                        ? this.displayedPoints.unshift(this.createPoint(res.x, res.y))
                        : this.displayedPoints.unshift(this.createPoint(res.y * Math.cos(res.x), res.y * Math.sin(res.x)));
                        break;
                }
                break;
        }
    }

    public async calculatePoints(func: Function, beginX: number, endX: number, direction: MovingDirection = MovingDirection.LEFT): Promise<void> {
        if(!this.calculatingWorker) return;
        
        if(func.mode === FunctionInputtingType.POLAR) {
            if(beginX < 0) beginX = 0;
            if(endX < 0) return;
        }

        const dx = delta * this.spacing;
        
        if(direction === MovingDirection.LEFT) {
            for(let x = beginX; x <= endX; x += dx) {
                // var y = await func.calculate(x);
                // this.displayedPoints.add(this.createPoint(x, y));
                this.calculatingWorker.postMessage({ type: "evaluate", id: func.id, mode: func.mode, root: func.root, x, operate: "add" });
            }
        } else {
            for(let x = endX; x >= beginX; x -= dx) {
                // var y = await func.calculate(x);
                // this.displayedPoints.unshift(this.createPoint(x, y));
                this.calculatingWorker.postMessage({ type: "evaluate", id: func.id, mode: func.mode, root: func.root, x, operate: "unshift" });
            }
        }
    }

    // MARK: Event Handlers

    public handleMouseDown(rect: DOMRect, cx: number, cy: number) {
        this.mouseDown = true;

        cx *= this.ratio;
        cy *= this.ratio;

        this.refreshMousePoint(rect, cx, cy);
        this.mouseDX = this.mousePoint.x - this.center.x;
        this.mouseDY = this.mousePoint.y - this.center.y;
    }

    public handleMouseMove(rect: DOMRect, cx: number, cy: number, direction: MovingDirection) {
        cx *= this.ratio;
        cy *= this.ratio;

        this.refreshMousePoint(rect, cx, cy);

        if(!this.mouseDown) return;

        this.center.x = this.mousePoint.x - this.mouseDX;
        this.center.y = this.mousePoint.y - this.mouseDY;

        this.moveFunctionImage(direction);
    }

    public handleMouseUp() {
        this.stopMoving();
        this.zoomingScale = null;
        this.lastZoomingSize = null;
        this.zoomingFocus = null;
    }

    public handleWheel(dy: number) {
        const delta = 10;
        const mouseOriginPoint = this.pointToCoordinates(this.mousePoint);
        const direction = dy > 0 ? ZoomDirection.ZOOM_OUT : ZoomDirection.ZOOM_IN;

        dy > 0
        ? this.scale -= delta / this.spacing
        : this.scale += delta / this.spacing;

        this.scalingAdapt(direction);
        this.zoomFunctionImage(direction);

        const mouseCurrentPoint = this.pointToCoordinates(this.mousePoint);
        var centerDx = mouseCurrentPoint.x - mouseOriginPoint.x,
            centerDy = mouseCurrentPoint.y - mouseOriginPoint.y;
        
        this.center.x += centerDx * this.scale;
        this.center.y -= centerDy * this.scale;
    }

    public handleTouchZoom(rect: DOMRect, cxA: number, cyA: number, cxB: number, cyB: number) {
        cxA *= this.ratio;
        cyA *= this.ratio;
        cxB *= this.ratio;
        cyB *= this.ratio;

        const screenA = this.createPoint(cxA - rect.left, cyA - rect.top);
        const screenB = this.createPoint(cxB - rect.left, cyB - rect.top);
        const zoomingSize = Math.sqrt((screenA.x - screenB.x) ** 2 + (screenA.y - screenB.y) ** 2);
        const direction = (this.lastZoomingSize && this.lastZoomingSize > zoomingSize)
        ? ZoomDirection.ZOOM_OUT
        : ZoomDirection.ZOOM_IN;

        if(!this.lastZoomingSize) this.lastZoomingSize = zoomingSize;

        if(!this.zoomingScale || !this.zoomingFocus) {
            this.zoomingScale = zoomingSize / this.scale;
            this.zoomingFocus = this.pointToCoordinates(this.createPoint((screenA.x + screenB.x) / 2, (screenA.y + screenB.y) / 2));
            return;
        }
        
        this.scale = zoomingSize / this.zoomingScale;

        this.scalingAdapt(direction);
        this.zoomFunctionImage(direction);

        this.lastZoomingSize = zoomingSize;

        const currentFocusPoint = this.pointToCoordinates(this.createPoint((screenA.x + screenB.x) / 2, (screenA.y + screenB.y) / 2));
        var centerDx = currentFocusPoint.x - this.zoomingFocus.x,
            centerDy = currentFocusPoint.y - this.zoomingFocus.y;

        this.center.x += centerDx * this.scale;
        this.center.y -= centerDy * this.scale;
    }

    public handleResize(width: number, height: number) {
        this.resize(width, height);
    }

    private refreshMousePoint(rect: DOMRect, cx: number, cy: number) {
        var mousePoint = this.createPoint(cx - rect.left, cy - rect.top);
        this.mousePoint = mousePoint;
    }

    // MARK: Function Image Operations

    private moveFunctionImage(direction: MovingDirection) {
        if(this.displayedPoints.length === 0) return;

        var unitPx = this.scale;
        var oldBegin = this.cameraPosition[0],
            newBegin = -this.center.x / unitPx,
            oldEnd = this.cameraPosition[1],
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

        // Refresh camera position
        this.cameraPosition = [newBegin, newEnd];
    }

    private zoomFunctionImage(direction: ZoomDirection) {
        if(this.displayedPoints.length === 0) return;

        var unitPx = this.scale;
        var oldBegin = this.cameraPosition[0],
            newBegin = -this.center.x / unitPx,
            oldEnd = this.cameraPosition[1],
            newEnd = (this.canvas.width - this.center.x) / unitPx;

        if(direction === ZoomDirection.ZOOM_IN) {
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

        // Refresh camera position
        this.cameraPosition = [newBegin, newEnd];
    }

    private stopMoving() {
        this.mouseDown = false;
        this.mouseDX = 0;
        this.mouseDY = 0;
    }

    private drawCompleteFunction() {
        var func = this.functionList.getLast();

        var unitPx = this.scale;

        var beginX = -this.center.x / unitPx;
        var endX = (this.canvas.width - this.center.x) / unitPx;

        this.calculatePoints(func, beginX, endX);
    }

    private fullyRefreshFunctions() {
        this.displayedPoints.clear();

        var unitPx = this.scale;

        var beginX = -this.center.x / unitPx;
        var endX = (this.canvas.width - this.center.x) / unitPx;

        this.functionList.forEach((func) => this.calculatePoints(func, beginX, endX));
    }

    public scalingAdapt(direction: ZoomDirection) {
        if(
            direction === ZoomDirection.ZOOM_OUT &&
            (
                (!this.isMobile && this.scale * this.spacing <= 66) ||
                (this.isMobile && this.scale * this.spacing <= 87)
            )
        ) {
            !Is.float(Math.log10(this.spacing / 2))
            ? this.spacing = Float.multiply(this.spacing, 2.5)
            : this.spacing = Float.multiply(this.spacing, 2);
        } else if(
            direction === ZoomDirection.ZOOM_IN &&
            (
                (!this.isMobile && this.scale * this.spacing >= 138) ||
                (this.isMobile && this.scale * this.spacing >= 190)
            )
        ) {
            !Is.float(Math.log10(this.spacing / 5))
            ? this.spacing = Float.divide(this.spacing, 2.5)
            : this.spacing = Float.divide(this.spacing, 2);
        }
    }

    // MARK: Function Operations

    public registerFunction(rawText: string, id: number, mode: FunctionInputtingType) {
        if(!this.calculatingWorker) return;

        this.calculatingWorker.postMessage({ type: "compile", rawText, id, mode });
    }

    public unregisterFunction(index: number) {
        this.resetCalculatingWorker();
        this.functionList.remove(index);
        this.fullyRefreshFunctions();
    }

    public unregisterAllFunctions() {
        this.resetCalculatingWorker();
        this.functionList.clear();
        this.displayedPoints.clear();
    }

    public editFunction(index: number, rawText: string, mode: FunctionInputtingType) {
        if(!this.calculatingWorker) return;

        this.calculatingWorker.postMessage({ type: "compile-and-set", index, rawText, mode });
    }

    public playFunction(index: number) {
        this.functionList.get(index).play(this.workerCtx);
    }

    // To render each frame
    // MARK: Render
    public override render() {
        this.updateFPS();
        super.render();

        // O point
        this.drawText("O", this.center.x - 20 * this.ratio, this.center.y + 20 * this.ratio, this.colors.primary, 17);

        // Mouse point
        var mouseCoordinatesPoint = this.pointToCoordinates(this.mousePoint);
        this.drawText("("+ Graphics.numberToString(mouseCoordinatesPoint.x, 2) +", "+ Graphics.numberToString(mouseCoordinatesPoint.y, 2) +")", (!this.isMobile ? 30 : 50) * this.ratio, 30 * this.ratio, this.colors.primary, 15);
        
        // Is mouse down
        this.drawText(this.mouseDown ? "Moving" : "", this.canvas.width - 80 * this.ratio, 30 * this.ratio, this.colors.primary, 15);

        // Draw function images
        for(let i = 0; i < this.displayedPoints.length; i++) {
            this.drawPoint(this.pointToScreen(this.displayedPoints.get(i)), this.colors.highlight);
        }

        var imageBitmap = this.canvas.transferToImageBitmap();
        this.workerCtx.postMessage({ type: "render", imageBitmap }, [imageBitmap]);
    }
    
    private updateFPS() {
        const now = (+new Date());
        var fps = 1000 / (now - this.lastTime);
        this.lastTime = now;

        this.currentFPS = fps;
    }

    public reset() {
        this.functionList.clear();
        this.displayedPoints.clear();
        clearInterval(this.fpsUpdater);
    }
}
