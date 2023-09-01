import ChildrenToken from "./ChildrenToken";
import { TokenType } from "./Token";

export default class RootToken extends ChildrenToken {
    public readonly type: TokenType = TokenType.ROOT;
}
