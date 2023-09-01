/* eslint-disable no-restricted-globals */
import React from "react";

import { NumberSys } from "../types";
import Transformer from "../compiler/Transformer";
import Is from "../compiler/Is";

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

    /** @see https://blog.csdn.net/crazyxiaoyuge/article/details/112189600 */
    public static getWindowConfig(): { width: number, height: number } {
        var width = window.innerWidth;
        var height = window.innerHeight;
        
        if(typeof width !== "number") {
            if(document.compatMode === "CSS1Compat") {
                width = document.documentElement.clientWidth;
                height = document.documentElement.clientHeight;
            } else {
                width = document.body.clientWidth;
                height = document.body.clientHeight;
            }
        }

        return { width, height };
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
            "\\", "`", "@", "#", "$", "&", "?", "_", ";", ":",
            "\"", "'", "{", "}", "<", ">",
            "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"
        ];

        return !(blocked.indexOf(symbol) > -1);
    }

    public static isAllowedProgrammingSymbol(symbol: string): boolean {
        const allowed = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
            "A", "B", "C", "D", "E", "F",
            "a", "b", "c", "d", "e", "f",
            "+", "-", "*", "/", "<", ">", "%",
            "Enter", "Backspace", "ArrowLeft", "ArrowRight"
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

    public static isMobile(): boolean {
        const mobileClients = [
            /Android/i,
            /webOS/i,
            /iPhone/i,
            /iPad/i,
            /iPod/i,
            /BlackBerry/i,
            /Windows Phone/i
        ];

        return mobileClients.some((reg) => window.navigator.userAgent.match(reg));
    }

    public static async writeClipboard(text: string): Promise<void> {
        try {
            await window.navigator.clipboard.writeText(text);
        } catch (e) {
            throw e;
        }
    }

    public static pitchToNoteStr(pitch: number): string {
        const noteList = ["C", "C#", "D", "D#", "E", "E#", "F", "F#", "G", "G#", "A", "A#", "B"];

        var delta = Math.floor(pitch / 13);
        delta = !Is.float(pitch / 13) && pitch !== 0 ? delta - 1 : delta;
        const part = 2 + delta;
        const note = noteList[Math.floor(pitch) % 13];

        return note + part.toString();
    }
}
