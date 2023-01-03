/* eslint-disable no-self-assign */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";

import Utils from "../../utils/Utils";

class Point {
    public x: number;
    public y: number;

    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class Render {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private mouseDown: boolean = false;
    private mouseDX: number = 0;
    private mouseDY: number = 0;

    private center: Point;

    public constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.center = new Point(this.canvas.width / 2, this.canvas.height / 2);

        this.initListeners();
    }

    private initListeners(): void {
        this.canvas.addEventListener("mousedown", (e: MouseEvent) => {
            this.mouseDown = true;

            var mousePoint = new Point(e.clientX, e.clientY);
            this.mouseDX = mousePoint.x - this.center.x;
            this.mouseDY = mousePoint.y - this.center.y;
        });
        this.canvas.addEventListener("mousemove", (e: MouseEvent) => {
            if(!this.mouseDown) return;

            var mousePoint = new Point(e.clientX, e.clientY);
            this.center.x = mousePoint.x - this.mouseDX;
            this.center.y = mousePoint.y - this.mouseDY;
        });
        this.canvas.addEventListener("mouseup", () => {
            this.mouseDown = false;
            this.mouseDX = 0;
            this.mouseDY = 0;
        });
    }

    public drawLine(begin: Point, end: Point, color: string, width?: number): void {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width ?? 1;
        this.ctx.moveTo(begin.x, begin.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.stroke();
    }

    public clear(): void {
        this.canvas.width = this.canvas.width;
        this.canvas.height = this.canvas.height;
    }

    public render(): void {
        this.clear();

        // x
        this.drawLine(new Point(0, this.center.y), new Point(this.canvas.width, this.center.y), "#8c949e", 2);
        // y
        this.drawLine(new Point(this.center.x, 0), new Point(this.center.x, this.canvas.height), "#8c949e", 2);

        // Draw image of functions
        /** @todo */
    }
}

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
        <div className="graphing-container" id="display-frame">
            <canvas className="graphing-canvas" id="graphing"/>
        </div>
    );
}

export default Graphing;
