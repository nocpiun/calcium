export default class Utils {
    public static getElem<E extends HTMLElement = HTMLElement>(id: string): E {
        return document.getElementById(id) as E ?? document.body;
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

    public static arrayRemove<T = any>(oldArray: T[], index: number): T[] {
        if(index < 0 || index >= oldArray.length) return [];
        var newArray = oldArray;

        var j = index;
        while(j < newArray.length) {
            newArray[j] = newArray[j + 1];
            j++;
        }
        newArray.pop();

        return newArray;
    }

    public static arrayPut<T = any>(oldArray: T[], index: number, item: T): T[] {
        if(index < 0 || index >= oldArray.length + 1) return [];
        var newArray = oldArray;

        newArray.splice(index, 0, item);
        return newArray;
    }

    public static isAllowedSymbol(symbol: string): boolean {
        const blocked = [
            "Tab", "CapsLock", "NumLock", "ScrollLock", "Shift", "Control", "Alt", "Meta", "ContextMenu",
            "Insert", "Home", "PageUp", "PageDown", "End", "Delete", "ArrowUp", "ArrowDown", "Pause", "Escape",
            "\\", "`", "@", "#", "$", "&", ";", ":", "\"",
            "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"
        ];

        return !(blocked.indexOf(symbol) > -1);
    }

    public static isAllowedProgrammingSymbol(symbol: string): boolean {
        const allowed = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
            "A", "B", "C", "D", "E", "F",
            "+", "-", "*", "/", "<", ">", "%",
            "Backspace", "ArrowLeft", "ArrowRight"
        ];

        return allowed.indexOf(symbol) > -1;
    }

    /** @see https://bbs.csdn.net/topics/310077618 */
    public static getOffsetLeft(elem: HTMLElement): number {
        var offset = elem.offsetLeft;
        if(elem.offsetParent) offset += Utils.getOffsetLeft(elem.offsetParent as HTMLElement);
        return offset;
    }

    public static is<T = unknown>(obj1: T, obj2: T): boolean {
        if(!(typeof obj1 === "object" && typeof obj2 === "object")) {
            return obj1 === obj2;
        }
    
        var isEqual = true;
        
        if(!obj2) return false;
        for(const i in obj1) {
            if(typeof obj1[i] === "object" && typeof obj2[i] === "object") {
                if(!Utils.is(obj1[i], obj2[i])) isEqual = false;
                continue;
            }
    
            if(obj1[i] !== obj2[i]) isEqual = false;
        }
    
        return isEqual;
    }
    
    public static arrayIs<T extends any[] = unknown[]>(arr1: T, arr2: T): boolean {
        if(arr1.length !== arr2.length) return false;
        
        for(let i = 0; i < arr1.length; i++) {
            if(arr1 instanceof Array && arr2 instanceof Array) {
                if(!Utils.arrayIs(arr1[i], arr2[i])) return false;
            }
            if(!Utils.is(arr1[i], arr2[i])) return false;
        }
    
        return true;
    }
    
    /** @see https://www.cnblogs.com/jialuchun/p/6559422.html */
    public static factorial(x: number): number {
        if(x < 0) {
            return -1;
        } else if(x === 0 || x === 1) {
            return 1;
        } else {
            for(let i = x - 1; i >= 1; i--) {
                x *= i;
            }
        }
        return x;
    }

    public static scrollToEnd(id: string, top: number = 1, left: number = 1): void {
        var elem = Utils.getElem(id);
        elem.scrollTo({ top: elem.scrollHeight * top, left: elem.scrollWidth * left });
    }
}
