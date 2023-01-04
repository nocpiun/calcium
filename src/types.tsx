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
    HEX, DEC, OCT, BIN
}

export interface InputButtonProps {
    symbol: string
    grow: number
    group?: string[]
    disabled?: boolean
}
