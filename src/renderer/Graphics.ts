/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable no-self-assign */
import { Theme } from "@/types";
import ComputeKits from "@/compiler/ComputeKits";
import Utils from "@/utils/Utils";

const initialScale = 90;
const minSn = !Utils.isMobile() ? 100000 : 10000; // Minimum scientific notation
const maxSn = 0.0005;

export enum Axis {
    CARTESIAN, POLAR
}

interface ColorScheme {
    primary: string,
    secondary: string,
    highlight: string
}

export interface Point {
    x: number
    y: number
}

export default class Graphics {
    public config: GraphicsConfig;
    public scale: number = initialScale; // px per unit length
    public spacing: number = 1; // unit length

    public center: Point;
    protected mousePoint: Point;

    public constructor(
        public canvas: OffscreenCanvas,
        protected ctx: OffscreenCanvasRenderingContext2D,
        protected ratio: number,
        protected isMobile: boolean,
        isDarkMode: boolean,
        axis: Axis
    ) {
        this.config = new GraphicsConfig(isDarkMode ? Theme.DARK : Theme.LIGHT, axis);
        this.scale *= this.ratio;
        this.center = this.createPoint(this.canvas.width / 2, this.canvas.height / 2);
        this.mousePoint = this.center;
    }

    protected get colors(): ColorScheme {
        return this.config.getColors();
    }

    public createPoint(x: number, y: number): Point {
        return { x, y };
    }

    // MARK: Axis

    protected refreshAxisLine() {
        this.config.getAxisType() === Axis.CARTESIAN
        ? this.drawCartesianAxis()
        : this.drawPolarAxis();
    }

    private drawCartesianAxis() {
        var unitPx = this.spacing * this.scale;
        var secondaryUnitPx = (this.spacing / 5) * this.scale;
        const numberFontSize = !this.isMobile ? 15 : 13;

        /**
         * X Direction
         */
        // X Axis
        this.drawStraightLine(this.center.y, this.colors.primary, 2);

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
            this.drawStraightLine(y1, this.colors.secondary);
            this.drawStraightLine(y2, this.colors.secondary);

            // number of the line
            const n = ComputeKits.multiply(i, this.spacing);
            const n1Width = this.getTextWidth(Graphics.numberToString(n), numberFontSize);
            const n2Width = this.getTextWidth(Graphics.numberToString(-n), numberFontSize);

            var x1 = this.center.x - (n1Width / this.ratio + 5) * this.ratio;
            var x2 = this.center.x - (n2Width / this.ratio + 5) * this.ratio;

            if(this.center.x - n1Width - 2 * 5 * this.ratio <= 0) {
                x1 = 5 * this.ratio;
            }
            if(this.center.x - n2Width - 2 * 5 * this.ratio <= 0) {
                x2 = 5 * this.ratio;
            }
            if(this.center.x >= this.canvas.width) {
                x1 = this.canvas.width - n1Width - 5 * this.ratio;
                x2 = this.canvas.width - n2Width - 5 * this.ratio;
            }

            this.drawNumber(
                n,
                x1,
                y1 + 5 * this.ratio,
                this.colors.primary,
                numberFontSize
            );
            this.drawNumber(
                -n,
                x2,
                y2 + 5 * this.ratio,
                this.colors.primary,
                numberFontSize
            );
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
            this.drawStraightLine(y1, this.colors.secondary, .3);
            this.drawStraightLine(y2, this.colors.secondary, .3);
        }

        /**
         * Y Direction
         */
        // Y Axis
        this.drawVerticalLine(this.center.x, this.colors.primary, 2);
        // thicker line
        for(
            let i = 1;
            (
                this.center.x - i * unitPx >= 0 ||
                this.center.x + i * unitPx <= this.canvas.width
            );
            i++
        ) {
            var x1 = this.center.x - i * unitPx;
            var x2 = this.center.x + i * unitPx;
            this.drawVerticalLine(x1, this.colors.secondary);
            this.drawVerticalLine(x2, this.colors.secondary);

            // number of the line
            const n = ComputeKits.multiply(i, this.spacing);
            const n1Width = this.getTextWidth(Graphics.numberToString(n), numberFontSize);
            const n2Width = this.getTextWidth(Graphics.numberToString(-n), numberFontSize);
            const height = this.getTextHeight(Graphics.numberToString(n), numberFontSize);

            var y = this.center.y + 15 * this.ratio;
            if(this.center.y <= 0) {
                y = 15 * this.ratio;
            }
            if(this.center.y + height + 2 * (15 * this.ratio - height) >= this.canvas.height) {
                y = this.canvas.height - (15 * this.ratio - height);
            }

            this.drawNumber(
                n,
                x2 - (n1Width / this.ratio / 2) * this.ratio,
                y,
                this.colors.primary,
                numberFontSize
            );
            this.drawNumber(
                -n,
                x1 - (n2Width / this.ratio / 2) * this.ratio,
                y,
                this.colors.primary,
                numberFontSize
            );
        }
        // thinner line
        for(
            let i = 1;
            (
                this.center.x - i * secondaryUnitPx >= 0 ||
                this.center.x + i * secondaryUnitPx <= this.canvas.width
            );
            i++
        ) {
            var x1 = this.center.x - i * secondaryUnitPx;
            var x2 = this.center.x + i * secondaryUnitPx;
            this.drawVerticalLine(x1, this.colors.secondary, .3);
            this.drawVerticalLine(x2, this.colors.secondary, .3);
        }
    }

    private drawPolarAxis() {
        var unitPx = this.spacing * this.scale;
        const maxRange = this.getMaxDrawingRange();

        // X Axis
        this.drawStraightLine(this.center.y, this.colors.primary, 2);
        // Y Axis
        this.drawVerticalLine(this.center.x, this.colors.primary, 2);
        // thicker line
        for(let i = 1; i * unitPx <= maxRange; i++) {
            var x1 = this.center.x - i * unitPx;
            var x2 = this.center.x + i * unitPx;
            this.drawCircle(this.center, x2 - this.center.x, this.colors.secondary);

            // number of the line
            const n = ComputeKits.multiply(i, this.spacing);
            this.drawNumber(n, x1 - (this.getTextWidth(Graphics.numberToString(n), 15) / this.ratio / 2) * this.ratio, this.center.y + 15 * this.ratio, this.colors.primary, 15);
            this.drawNumber(n, x2 - (this.getTextWidth(Graphics.numberToString(n), 15) / this.ratio / 2) * this.ratio, this.center.y + 15 * this.ratio, this.colors.primary, 15);
        }
        // thinner line
        for(let i = 1; i * unitPx * (Math.PI / 2) <= maxRange; i++) {
            var x = this.center.x + i * unitPx * (Math.PI / 2);
            this.drawCircle(this.center, x - this.center.x, this.colors.secondary, .3);
        }

        // ray line
        for(let i = Math.PI / 12; i < 2 * Math.PI; i += Math.PI / 12) {
            this.drawRay(this.center, i, this.colors.secondary);
        }
    }

    // MARK: Basic Methods

    protected drawLine(begin: Point, end: Point, color: string, width: number = 1) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width * this.ratio;
        this.ctx.moveTo(begin.x, begin.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    protected drawCircle(center: Point, radius: number, color: string, width: number = 1) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width * this.ratio;
        this.ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    protected drawRay(begin: Point, angle: number, color: string, width: number = 1) {
        this.drawLine(begin, this.getBorderPoint(begin, angle), color, width);
    }

    protected drawPoint(point: Point, color: string) {
        const size = this.isMobile ? 5 : 2;

        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.fillRect(point.x, point.y, size, size);
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

    protected drawNumber(n: number, x: number, y: number, color: string, fontSize: number = 20) {
        const abs = Math.abs(n);
        var str = Graphics.numberToString(n);

        if(abs < minSn && abs > maxSn) {
            this.drawText(str, x, y, color, fontSize);
            return;
        }

        const base = str.split("^")[0];
        const exponent = str.split("^")[1];

        var baseWidth = this.getTextWidth(base, fontSize);

        if(!this.isMobile) {
            this.drawText(base, x + 7, y, color, fontSize);
            this.drawText(exponent, x + baseWidth + 7, y - 3, color, 11);
        } else {
            this.drawText(base, x + 15, y, color, fontSize);
            this.drawText(exponent, x + baseWidth + 15, y - 7, color, 11);
        }
    }

    protected clear() {
        this.canvas.width = this.canvas.width;
        this.canvas.height = this.canvas.height;
    }

    protected resize(width: number, height: number) {
        const oldWidth = this.canvas.width;
        const oldHeight = this.canvas.height;

        this.canvas.width = width;
        this.canvas.height = height;

        this.center.x = width * (this.center.x / oldWidth);
        this.center.y = height * (this.center.y / oldHeight);
    }

    // MARK: Utilities

    private getMaxDrawingRange(): number {
        return Math.max(
            Math.sqrt(this.center.x ** 2 + this.center.y ** 2),
            Math.sqrt((this.canvas.width - this.center.x) ** 2 + this.center.y ** 2),
            Math.sqrt(this.center.x ** 2 + (this.canvas.height - this.center.y) ** 2),
            Math.sqrt((this.canvas.width - this.center.x) ** 2 + (this.canvas.height - this.center.y) ** 2),
        ); // Max length of center point to corners
    }

    private getBorderPoint(begin: Point, angle: number): Point {
        if(angle < 0 || angle > 2 * Math.PI) return this.createPoint(0, 0);

        var x = 0;
        var y = 0;
        const maxRange = this.getMaxDrawingRange();

        x = begin.x + maxRange * Math.cos(angle);
        y = begin.y - maxRange * Math.sin(angle);

        return this.createPoint(x, y);
    }

    public getTextWidth(text: string, fontSize: number = 20): number {
        this.ctx.font = (fontSize * this.ratio) + "px Ubuntu-Regular";
        return this.ctx.measureText(text).width;
    }

    public getTextHeight(text: string, fontSize: number = 20): number {
        this.ctx.font = (fontSize * this.ratio) + "px Ubuntu-Regular";
        
        var metrics = this.ctx.measureText(text);
        return metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    }

    protected pointToCoordinates(point: Point): Point {
        var unitPx = this.scale;
        return {
            x: (point.x - this.center.x) / unitPx,
            y: -(point.y - this.center.y) / unitPx
        };
    }

    protected pointToScreen(point: Point): Point {
        var unitPx = this.scale;
        return {
            x: this.center.x + (point.x * unitPx),
            y: this.center.y - (point.y * unitPx)
        };
    }

    public static numberToString(n: number, fractionDigits?: number): string {
        const abs = Math.abs(n);

        if(abs < minSn && abs > maxSn) {
            return fractionDigits !== undefined ? n.toFixed(fractionDigits) : n.toString();
        }

        var exponent = Math.floor(Math.log10(abs));
        var coefficient = ComputeKits.divide(n, 10 ** exponent);

        return `${fractionDigits !== undefined ? coefficient.toFixed(fractionDigits) : coefficient}×10^${exponent}`;
    }

    // To render each frame
    // MARK: Render
    public render() {
        this.clear();

        this.refreshAxisLine();
    }
}

// MARK: Configuration
class GraphicsConfig {
    private static readonly lightColors: ColorScheme = {
        primary: "#404041",
        secondary: "#8c949e",
        highlight: "#222"
    };
    private static readonly darkColors: ColorScheme = {
        primary: "#cbd0df",
        secondary: "#8c949e",
        highlight: "#fff"
    };

    public constructor(
        private theme: Theme,
        private axis: Axis
    ) { }

    public getColors(): ColorScheme {
        return this.theme === Theme.LIGHT
        ? GraphicsConfig.lightColors
        : GraphicsConfig.darkColors;
    }

    public getAxisType(): Axis {
        return this.axis;
    }

    public setTheme(theme: Theme) {
        this.theme = theme;
    }

    public setAxisType(axis: Axis) {
        this.axis = axis;
    }
}
