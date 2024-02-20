import Graphics from "@/renderer/Graphics";

export default class Point {
    public constructor(
        private graphics: Graphics,
        public x: number,
        public y: number
    ) { }

    public toCoordinates(): Point {
        var unitPx = this.graphics.scale;
        return new Point(this.graphics, (this.x - this.graphics.center.x) / unitPx, -(this.y - this.graphics.center.y) / unitPx);
    }

    public toScreen(): Point {
        var unitPx = this.graphics.scale;
        return new Point(this.graphics, this.graphics.center.x + (this.x * unitPx), this.graphics.center.y - (this.y * unitPx));
    }
}
