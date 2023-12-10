import ChildrenToken from "@/compiler/token/ChildrenToken";
import { TokenType } from "@/compiler/token/Token";

export default class RootToken extends ChildrenToken {
    public readonly type: TokenType = TokenType.ROOT;

    /**
     * We cannot clone an object with function(s) to pass it
     * to a worker, so a root token cloned and passed to a
     * worker should be put into this `create()` method to
     * let it be transformed into an object with function(s).
     */
    public static create(rootObject: RootToken): RootToken {
        return new RootToken(rootObject.value);
    }
}
