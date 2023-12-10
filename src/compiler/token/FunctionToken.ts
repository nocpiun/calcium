import Token, { TokenType } from "@/compiler/token/Token";

export default class FunctionToken extends Token<void> {
    public readonly type: TokenType = TokenType.FUNCTION;

    public func: string;
    public param: Token[];

    public constructor(func: string, param: Token[]) {
        super();

        this.func = func;
        this.param = param;
    }
}
