/* eslint-disable no-restricted-globals */
import React from "react";

import { NumberSys } from "../types";
import Transformer from "../compiler/Transformer";

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
        return (self.devicePixelRatio || 1) / backingStore;
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
            return NaN;
        } else if(x === 0 || x === 1) {
            return 1;
        } else if(Math.floor(x) === x) {
            for(let i = x - 1; i >= 1; i--) {
                x *= i;
            }
            return x;
        }

        return Utils.gamma(x + 1);
    }

    /** @see https://rosettacode.org/wiki/Gamma_function#JavaScript */
    public static gamma(x: number): number {
        const p = [
            0.99999999999980993, 676.5203681218851, -1259.1392167224028,
            771.32342877765313, -176.61502916214059, 12.507343278686905,
            -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
        ];
    
        const g = 7;
        if(x < 0.5) {
            return Math.PI / (Math.sin(Math.PI * x) * Utils.gamma(1 - x));
        }
    
        x -= 1;
        var a = p[0];
        const t = x + g + 0.5;
        for(var i = 1; i < p.length; i++) {
            a += p[i] / (x + i);
        }
    
        return Math.sqrt(2 * Math.PI) * Math.pow(t, x + 0.5) * Math.exp(-t) * a;
    }

    public static scrollToEnd(id: string, top: number = 1, left: number = 1): void {
        var elem = Utils.getElem(id);
        elem.scrollTo({ top: elem.scrollHeight * top, left: elem.scrollWidth * left });
    }

    public static getCurrentState<T>(setState: React.Dispatch<React.SetStateAction<T>>): Promise<T> {
        return new Promise((resolve, reject) => {
            setState((currentState) => {
                resolve(currentState);
                return currentState;
            });
        });
    }

    public static mean(...nums: number[]): number {
        var sum = 0;
        for(let i = 0; i < nums.length; i++) {
            sum += nums[i];
        }
        return sum / nums.length;
    }

    public static stdev(...nums: number[]): number {
        var average = Utils.mean(...nums);
        var devPowList = [];
        for(let i = 0; i < nums.length; i++) {
            devPowList.push(Utils.safePow(nums[i] - average, 2));
        }
        
        var devPowSum = 0;
        for(let i = 0; i < devPowList.length; i++) {
            devPowSum += devPowList[i];
        }

        return Math.sqrt(devPowSum / (nums.length - 1));
    }

    public static stdevp(...nums: number[]): number {
        var average = Utils.mean(...nums);
        var devPowList = [];
        for(let i = 0; i < nums.length; i++) {
            devPowList.push(Utils.safePow(nums[i] - average, 2));
        }
        
        var devPowSum = 0;
        for(let i = 0; i < devPowList.length; i++) {
            devPowSum += devPowList[i];
        }

        return Math.sqrt(devPowSum / nums.length);
    }

    public static nPr(n: number, r: number): number {
        return Utils.factorial(n) / Utils.factorial(n - r);
    }

    public static nCr(n: number, r: number): number {
        return Utils.factorial(n) / (Utils.factorial(r) * Utils.factorial(n - r));
    }

    public static safeTan(x: number): number {
        var result = Math.tan(x);
        if(result > 136059276645184) return NaN;
        if(result < -286411383293068) return NaN;
        return result;
    }

    public static safePow(x: number, y: number): number {
        if(y === 0) return 1;
        return y > 0 ? Math.pow(x, y) : (1 / Math.pow(x, -y));
    }

    public static strToNum(str: string, numberSys: NumberSys): number {
        if(numberSys === NumberSys.HEX) {
            return parseInt(Transformer.hexToDec(str));
        } else {
            return parseFloat(str);
        }
    }

    public static isDarkMode(): boolean {
        return document.body.getAttribute("theme") === "dark";
    }

    public static isAnyDialogOpen(): boolean {
        var dialogs = document.getElementsByTagName("dialog");
        for(let i = 0; i < dialogs.length; i++) {
            if(dialogs[i].open) return true;
        }
        return false;
    }
}
