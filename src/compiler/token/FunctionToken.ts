import Token, { TokenType } from "@/compiler/token/Token";

export default class FunctionToken extends Token<void> {
    public readonly type: TokenType = TokenType.FUNCTION;
    
    public constructor(public func: string, public param: Token[]) {
        super();
    }
}
