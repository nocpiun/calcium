import type { MathFunction } from "../../types";
import Token, { TokenType } from "./Token";

export default class FunctionToken extends Token<void> {
    public readonly type: TokenType = TokenType.FUNCTION;

    public func: MathFunction[0];
    public param: Token[];

    public constructor(func: MathFunction[0], param: Token[]) {
        super();

        this.func = func;
        this.param = param;
    }
}
