import type { Operator } from "@/types";
import Token, { TokenType } from "@/compiler/token/Token";

export default class OperatorToken extends Token<Operator> {
    public readonly type: TokenType = TokenType.OPERATOR;

    public isFirst: boolean;

    public constructor(value: Operator, isFirst: boolean) {
        super(value);

        this.isFirst = isFirst;
    }
}
