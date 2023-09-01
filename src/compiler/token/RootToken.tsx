import ChildrenToken from "./ChildrenToken";
import Token, { TokenType } from "./Token";

export default class RootToken extends ChildrenToken {
    public readonly type: TokenType = TokenType.ROOT;

    public variables: Map<string, string>;

    public constructor(value: Token[], variables: Map<string, string>) {
        super(value);

        this.variables = variables;
    }
}
