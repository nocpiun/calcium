import Utils from "./utils/Utils";
import Emitter from "./utils/Emitter";
import { MathFunction, Shortcut } from "./types";

export const version = "0.3.0a";
export const errorText = "\\text{Error}";

export const functions: Map<string, MathFunction> = new Map([
    ["sin",          [(x) => Math.sin(x),            1]],
    ["cos",          [(x) => Math.cos(x),            1]],
    ["tan",          [(x) => Math.tan(x),            1]],
    ["cot",          [(x) => 1 / Math.tan(x),        1]],
    ["sec",          [(x) => 1 / Math.cos(x),        1]],
    ["csc",          [(x) => 1 / Math.sin(x),        1]],
    ["sin^{-1}",     [(x) => Math.asin(x),           1]],
    ["cos^{-1}",     [(x) => Math.acos(x),           1]],
    ["tan^{-1}",     [(x) => Math.atan(x),           1]],
    ["sinh",         [(x) => Math.sinh(x),           1]],
    ["cosh",         [(x) => Math.cosh(x),           1]],
    ["tanh",         [(x) => Math.tanh(x),           1]],
    ["coth",         [(x) => 1 / Math.tanh(x),       1]],
    ["text{sech}",   [(x) => 1 / Math.cosh(x),       1]],
    ["text{csch}",   [(x) => 1 / Math.sinh(x),       1]],
    ["ln",           [(x) => Math.log(x),            1]],
    ["lg",           [(x) => Math.log10(x),          1]],
    ["log_2",        [(x) => Math.log2(x),           1]],
    ["deg",          [(x) => x * (Math.PI / 180),    1]],
    ["text{rad}",    [(x) => x * (180 / Math.PI),    1]],
    ["√",            [(x) => Math.sqrt(x),           1]],
    ["^3√",          [(x) => Math.cbrt(x),           1]],
    ["%",            [(x) => x / 100,                1]],
    ["text{not}",    [(x) => ~x,                     1]],
    ["text{mean}",   [(...n) => Utils.mean(...n),   -1]],
    ["text{stdev}",  [(...n) => Utils.stdev(...n),  -1]],
    ["text{stdevp}", [(...n) => Utils.stdevp(...n), -1]],
    ["text{nPr}",    [(n, r) => Utils.nPr(n, r),     2]],
    ["text{nCr}",    [(n, r) => Utils.nCr(n, r),     2]],
]);

export const constants: Map<string, number> = new Map([
    ["\\pi",  Math.PI],
    ["e",     Math.E],
    ["\\phi", (Math.sqrt(5) - 1) / 2],
]);

export const shortcuts: Map<string[], Shortcut> = new Map([
    [["ctrl", "x"], {
        description: "Reset Input",
        action: () => {
            Emitter.get().emit("clear-input");
        }
    }],
    [["ctrl", "d"], {
        description: "Reset History Records",
        action: () => {
            Emitter.get().emit("clear-record");
        }
    }],
    [["ctrl", "r"], {
        description: "Reset Input, History and Function List",
        action: () => {
            Emitter.get().emit("clear-record");
            Emitter.get().emit("clear-input");
            Emitter.get().emit("clear-function");
        }
    }],
    [["shift", "ArrowLeft"], {
        description: "Move the Cursor to the Front",
        action: () => {
            Emitter.get().emit("move-front");
        }
    }],
    [["shift", "ArrowRight"], {
        description: "Move the Cursor to the Back",
        action: () => {
            Emitter.get().emit("move-back");
        }
    }],
]);
