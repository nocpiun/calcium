import PowerableToken from "./PowerableToken";
import { TokenType } from "./Token";

export default class VariableToken extends PowerableToken<void> {
    public type: TokenType = TokenType.VARIABLE;

    public name: string;
    public factorial?: {
        first: boolean
    };

    public constructor(name: string) {
        super();

        this.name = name;
    }
}
