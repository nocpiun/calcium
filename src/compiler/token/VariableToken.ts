import PowerableToken from "@/compiler/token/PowerableToken";
import { TokenType } from "@/compiler/token/Token";

export default class VariableToken extends PowerableToken<void> {
    public type: TokenType = TokenType.VARIABLE;

    public factorial?: {
        first: boolean
    };

    public constructor(public name: string) {
        super();
    }
}
