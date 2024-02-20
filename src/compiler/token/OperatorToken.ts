import type { Operator } from "@/types";
import Token, { TokenType } from "@/compiler/token/Token";

export default class OperatorToken extends Token<Operator> {
    public readonly type: TokenType = TokenType.OPERATOR;

    public constructor(value: Operator, public isFirst: boolean) {
        super(value);
    }
}
