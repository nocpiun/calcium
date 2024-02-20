import ChildrenToken from "@/compiler/token/ChildrenToken";
import Token, { TokenType } from "@/compiler/token/Token";

export default class AbsToken extends ChildrenToken {
    public readonly type: TokenType = TokenType.ABS;

    public constructor(value: Token[], public factorial: boolean) {
        super(value);
    }
}
