import type { FunctionInfo } from "@/types";
import Token, { TokenType } from "@/compiler/token/Token";

export default class FunctionToken extends Token<void> {
    public readonly type: TokenType = TokenType.FUNCTION;

    public func: FunctionInfo[0];
    public param: Token[];

    public constructor(func: FunctionInfo[0], param: Token[]) {
        super();

        this.func = func;
        this.param = param;
    }
}
