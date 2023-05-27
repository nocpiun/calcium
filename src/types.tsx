import React, { ReactElement } from "react";

export type StateSetter<S> = React.Dispatch<React.SetStateAction<S>>;

export enum Mode {
    GENERAL,
    GRAPHING,
    PROGRAMMING
}

export enum NumberSys {
    HEX = "hex",
    DEC = "dec",
    OCT = "oct",
    BIN = "bin"
}

export enum Operator {
    ADD = "+",
    SUB = "-",
    MUL = "×",
    DIV = "/",
    AND = "and",
    OR = "or",
    NAND = "nand",
    NOR = "nor",
    XOR = "xor",
    LSH = "lsh",
    RSH = "rsh",
}

export type MathFunction = [(...params: number[]) => number, number /* amount of params */];

export type WorkerResponse = {
    imageBitmap: ImageBitmap
}

export interface PromiseExecutor {
    resolve: (value: WorkerResponse) => void
    reject: (reason?: any) => void
}

export interface WorkerInfo extends PromiseExecutor {
    workData: any
}

export interface PropsWithRef<T> {
    ref: React.Ref<T>
}

export interface PropsWithChildren {
    children?: ReactElement | ReactElement[] | undefined
}

type TokenType = "root" | "void" | "number" | "operator" | "bracket" | "abs" | "function";

export interface Token {
    type: TokenType
}

export interface ValueToken<V> extends Token {
    value: V
}

export interface ChildrenToken extends Token {
    children: Token[]
}

export interface RootToken extends ChildrenToken {
    type: "root"
}

export const VoidToken: Token = {
    type: "void"
};

export interface NumberToken extends ValueToken<number> {
    type: "number"
    float: boolean
    numberSys: NumberSys
}

export interface OperatorToken extends ValueToken<Operator> {
    isFirst: boolean
}

export interface BracketToken extends ChildrenToken {
    factorial: boolean
}

export interface FunctionToken extends Token {
    type: "function"
    func: MathFunction[0]
    param: Token[]
}

export interface Shortcut {
    description: string
    action: () => void
}

export enum MouseDirection {
    LEFT, RIGHT
}

export enum ZoomDirection {
    ZOOM_IN, ZOOM_OUT
}

export interface UnitType {
    id: string
    name: string
    isDefault: boolean
    units: UnitInfo[]
}

export interface UnitInfo {
    name: string
    displayName: string
    transform: number
    isBase: boolean
}
