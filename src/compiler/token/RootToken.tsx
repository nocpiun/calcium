import ChildrenToken from "@/compiler/token/ChildrenToken";
import { TokenType } from "@/compiler/token/Token";

export default class RootToken extends ChildrenToken {
    public readonly type: TokenType = TokenType.ROOT;
}
