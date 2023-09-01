import { NumberSys } from "../../types";
import Compiler from "../Compiler";
import { TokenType } from "./Token";
import DynamicToken from "./DynamicToken";

export default class ProdToken extends DynamicToken {
    public type: TokenType = TokenType.PROD;

    public i: number;
    public n: number;

    public constructor(i: number, n: number, raw: string[], variables: Map<string, string>) {
        super(raw, variables);

        this.i = i;
        this.n = n;
    }

    public evaluate(): number {
        var result = 1;
        for(let i = this.i; i <= this.n; i++) {
            var compiler = new Compiler(this.raw, this.variables.set("i", i.toString()), false, NumberSys.DEC);
            result *= parseFloat(compiler.compile());
        }
        return result;
    }
}
