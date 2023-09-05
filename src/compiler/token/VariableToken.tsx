import { NumberSys } from "../../types";
import NumberToken from "./NumberToken";
import { TokenType } from "./Token";

export default class VariableToken extends NumberToken {
    public type: TokenType = TokenType.VARIABLE;

    public name: string;

    public constructor(name: string) {
        super(NaN, NumberSys.DEC);

        this.name = name;
    }
}
