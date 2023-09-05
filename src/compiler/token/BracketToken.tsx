import ChildrenToken from "@/compiler/token/ChildrenToken";
import Token, { TokenType } from "@/compiler/token/Token";

export default class BracketToken extends ChildrenToken {
    public readonly type: TokenType = TokenType.BRACKET;

    public factorial: boolean;

    public constructor(value: Token[], factorial: boolean) {
        super(value);

        this.factorial = factorial;
    }
}
