import ChildrenToken from "@/compiler/token/ChildrenToken";
import Token, { TokenType } from "@/compiler/token/Token";

export default class BracketToken extends ChildrenToken {
    public readonly type: TokenType = TokenType.BRACKET;

    public constructor(value: Token[], public factorial: boolean) {
        super(value);
    }
}
