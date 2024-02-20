/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable no-self-assign */
import Point from "@/renderer/Point";

const initialScale = 90;

export default class Graphics {
    public static colors = {
        primary: "#cbd0df",
        secondary: "#8c949e",
        highlight: "#fff"
    };

    public scale: number = initialScale; // px per unit length
    public spacing: number = 1; // unit length

    public center: Point;
    protected mousePoint: Point;

    public constructor(
        public canvas: OffscreenCanvas,
        protected ctx: OffscreenCanvasRenderingContext2D,
        protected ratio: number,
        protected isMobile: boolean,
        isDarkMode: boolean
    ) {
        this.scale *= this.ratio;
        this.center = this.createPoint(this.canvas.width / 2, this.canvas.height / 2);
        this.mousePoint = this.center;

        // Appearance
        if(!isDarkMode) Graphics.changeToDark();
    }

    public static changeToDark() {
        Graphics.colors.primary = "#404041";
        Graphics.colors.highlight = "#222";
    }

    public static changeToLight() {
        Graphics.colors.primary = "#cbd0df";
        Graphics.colors.highlight = "#fff";
    }

    public createPoint(x: number, y: number): Point {
        return new Point(this, x, y);
    }

    protected refreshAxisLine() {
        var unitPx = this.spacing * this.scale;
        var secondaryUnitPx = (this.spacing / 5) * this.scale;
        /**
         * X Direction
         */
        // X Axis
        this.drawStraightLine(this.center.y, Graphics.colors.primary, 2);
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
            this.drawStraightLine(y1, Graphics.colors.secondary);
            this.drawStraightLine(y2, Graphics.colors.secondary);

            // number of the line
            this.drawText((i * this.spacing).toString(), this.center.x - (this.getTextWidth((i * this.spacing).toString()) / this.ratio + 5) * this.ratio, y1 + 5 * this.ratio, Graphics.colors.primary, 15);
            this.drawText((-i * this.spacing).toString(), this.center.x - (this.getTextWidth((-i * this.spacing).toString()) / this.ratio + 5) * this.ratio, y2 + 5 * this.ratio, Graphics.colors.primary, 15);
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
            this.drawStraightLine(y1, Graphics.colors.secondary, .3);
            this.drawStraightLine(y2, Graphics.colors.secondary, .3);
        }

        /**
         * Y Direction
         */
        // Y Axis
        this.drawVerticalLine(this.center.x, Graphics.colors.primary, 2);
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
            this.drawVerticalLine(x1, Graphics.colors.secondary);
            this.drawVerticalLine(x2, Graphics.colors.secondary);

            // number of the line
            this.drawText((-k * this.spacing).toString(), x1 - (this.getTextWidth((-k * this.spacing).toString()) / this.ratio / 2) * this.ratio, this.center.y + 15 * this.ratio, Graphics.colors.primary, 15);
            this.drawText((k * this.spacing).toString(), x2 - (this.getTextWidth((k * this.spacing).toString()) / this.ratio / 2) * this.ratio, this.center.y + 15 * this.ratio, Graphics.colors.primary, 15);
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
            this.drawVerticalLine(x1, Graphics.colors.secondary, .3);
            this.drawVerticalLine(x2, Graphics.colors.secondary, .3);
        }
    }

    protected drawLine(begin: Point, end: Point, color: string, width: number = 1) {
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

    protected drawPoint(point: Point, color: string) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.fillRect(point.x, point.y, 2, 2);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    protected drawStraightLine(y: number, color: string, width: number = 1) {
        this.drawLine(this.createPoint(0, y), this.createPoint(this.canvas.width, y), color, width);
    }

    protected drawVerticalLine(x: number, color: string, width: number = 1) {
        this.drawLine(this.createPoint(x, 0), this.createPoint(x, this.canvas.height), color, width);
    }

    protected drawText(text: string, x: number, y: number, color: string, fontSize: number = 20) {
        this.ctx.font = (fontSize * this.ratio) +"px Ubuntu-Regular";
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y);
    }

    protected clear() {
        this.canvas.width = this.canvas.width;
        this.canvas.height = this.canvas.height;
    }

    // To render each frame
    public render() {
        this.clear();

        this.refreshAxisLine();
    }

    public getTextWidth(text: string): number {
        return this.ctx.measureText(text).width;
    }
}
