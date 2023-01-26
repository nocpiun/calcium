import Point from "./components/graphing/Point";

export enum Mode {
    GENERAL,
    GRAPHING,
    PROGRAMMING
}

export enum NumberType {
    HEX = "hex",
    DEC = "dec",
    OCT = "oct",
    BIN = "bin"
}

export enum Operator {
    ADD = "+",
    SUB = "-",
    MUL = "×",
    DIV = "/"
}

export type MathFunction = (x: number) => number;

export interface WorkerRequest {
    rawText: string
    scale: number
    spacing: number
    center: Point
    canvasWidth: number
}

export type WorkerResponse = {
    x1: number
    y1: number
    x2: number
    y2: number
}[]

export interface PromiseExecutor {
    resolve: (value: WorkerResponse) => void
    reject: (reason?: any) => void
}

export interface WorkerInfo extends PromiseExecutor {
    workData: WorkerRequest
}
