import type { NumberSys } from "../../types";
import PowerableToken from "./PowerableToken";
import { TokenType } from "./Token";

export default class NumberToken extends PowerableToken<number> {
    public readonly type: TokenType = TokenType.NUMBER;

    public float: boolean;
    public numberSys: NumberSys;

    public constructor(value: number, float: boolean, numberSys: NumberSys) {
        super(value);

        this.float = float;
        this.numberSys = numberSys;
    }
}
