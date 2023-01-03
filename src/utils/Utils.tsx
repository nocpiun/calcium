import { NumberType } from "../types";

export default class Utils {
    public static getElem<E extends HTMLElement = HTMLElement>(id: string): E {
        return document.getElementById(id) as E ?? document.body;
    }

    public static numberTypeToStr(type: NumberType): string {
        switch(type) {
            case NumberType.HEX:
                return "hex";
            case NumberType.DEC:
                return "dec";
            case NumberType.OCT:
                return "oct";
            case NumberType.BIN:
                return "bin";
        }
    }

    public static getPixelRatio(ctx: any): number {
        var backingStore = ctx.backingStorePixelRatio ||
            ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1;
        return (window.devicePixelRatio || 1) / backingStore;
    }
}
