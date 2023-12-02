import Render from "@/workers/Render";

export default class Point {
    private renderer: Render;

    public x: number;
    public y: number;

    public constructor(renderer: Render, x: number, y: number) {
        this.renderer = renderer;
        this.x = x;
        this.y = y;
    }

    public toCoordinates(): Point {
        var unitPx = this.renderer.scale;
        return new Point(this.renderer, (this.x - this.renderer.center.x) / unitPx, -(this.y - this.renderer.center.y) / unitPx);
    }

    public toScreen(): Point {
        var unitPx = this.renderer.scale;
        return new Point(this.renderer, this.renderer.center.x + (this.x * unitPx), this.renderer.center.y - (this.y * unitPx));
    }
}
