import ChildrenToken from "./ChildrenToken";
import Token, { TokenType } from "./Token";

export default class AbsToken extends ChildrenToken {
    public readonly type: TokenType = TokenType.ABS;

    public factorial: boolean;

    public constructor(value: Token[], factorial: boolean) {
        super(value);

        this.factorial = factorial;
    }
}
