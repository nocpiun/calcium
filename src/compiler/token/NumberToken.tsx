import type { NumberSys } from "../../types";
import PowerableToken from "./PowerableToken";
import { TokenType } from "./Token";

import Is from "../Is";

export default class NumberToken extends PowerableToken<number> {
    public readonly type: TokenType = TokenType.NUMBER;

    public float: boolean;
    public numberSys: NumberSys;

    public constructor(value: number, numberSys: NumberSys) {
        super(value);

        this.value = value;
        this.float = Is.float(value);
        this.numberSys = numberSys;
    }

    /**
     * You must use `setValue()` to change the value of a number token,
     * Because in this way, the float property will be changed by the value.
     */
    public setValue(value: number): void {
        this.value = value;
        this.float = Is.float(value);
    }
}
