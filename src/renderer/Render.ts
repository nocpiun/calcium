/* eslint-disable @typescript-eslint/no-redeclare */
import Graphics from "@/renderer/Graphics";
import Point from "@/renderer/Point";
import Function from "@/renderer/Function";
import RootToken from "@/compiler/token/RootToken";

import List from "@/utils/List";
import Collection from "@/utils/Collection";
import { MovingDirection, ZoomDirection } from "@/types";

export const delta: number = .01;

export default class Render extends Graphics {
    private workerCtx: Worker;
    private calculatingWorker: Worker = new Worker(new URL("@/workers/calculating.worker.ts", import.meta.url));

    private mouseDown: boolean = false;
    private mouseDX: number = 0; // mouse delta x
    private mouseDY: number = 0; // mouse delta y

    private fpsUpdater: NodeJS.Timer;
    private currentFPS: number = 0;
    private lastTime: number = 0; // for FPS calculating

    public functionList: List<Function> = new List();
    private displayedPoints: Collection<Point> = new Collection();

    public constructor(
        canvas: OffscreenCanvas,
        ctx: OffscreenCanvasRenderingContext2D,
        ratio: number,
        workerCtx: Worker,
        isDarkMode: boolean,
        isMobile: boolean
    ) {
        super(canvas, ctx, ratio, isDarkMode, isMobile);

        this.workerCtx = workerCtx;
        this.center = this.createPoint(this.canvas.width / 2, this.canvas.height / 2);

        // FPS
        this.fpsUpdater = setInterval(() => this.workerCtx.postMessage({ type: "fps", fps: this.currentFPS }), 1000);

        // Worker listener
        this.calculatingWorker.addEventListener("message", (e) => this.handleCalculatingWorkerMessaging(e));
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

    private updateFPS(): void {
        const now = (+new Date());
        var fps = 1000 / (now - this.lastTime);
        this.lastTime = now;

        this.currentFPS = fps;
    }

    // To render each frame
    public render(): void {
        this.updateFPS();
        super.render();

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
