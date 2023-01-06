export interface ModeButtonProps {
    modeName: string
    mode: Mode
    icon: string
}

export enum Mode {
    GENERAL,
    GRAPHING,
    PROGRAMMING
}

export interface NumberBoxProps {
    name: string
    number: number
    type: NumberType
}

export enum NumberType {
    HEX = "hex",
    DEC = "dec",
    OCT = "oct",
    BIN = "bin"
}

export interface InputButtonProps {
    symbol: string
    inputValue?: string
    grow: number
    group?: string[]
    disabled?: boolean
}

export enum Operator {
    ADD = "+",
    SUB = "-",
    MUL = "×",
    DIV = "/"
}
