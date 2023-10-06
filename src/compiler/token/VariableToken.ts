import PowerableToken from "@/compiler/token/PowerableToken";
import { TokenType } from "@/compiler/token/Token";

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
