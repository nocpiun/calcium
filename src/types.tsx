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

export interface WorkerMessageType {
    
}
