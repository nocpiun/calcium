import { NumberSys } from "@/types";
import Compiler from "@/compiler/Compiler";
import { TokenType } from "@/compiler/token/Token";
import DynamicToken from "@/compiler/token/DynamicToken";

export default class SigmaToken extends DynamicToken {
    public type: TokenType = TokenType.SIGMA;

    public i: number;
    public n: number;

    public constructor(i: number, n: number, raw: string[], variables: Map<string, string>) {
        super(raw, variables);

        this.i = i;
        this.n = n;
    }

    public evaluate(): number {
        var result = 0;
        for(let i = this.i; i <= this.n; i++) {
            var compiler = new Compiler(this.raw, this.variables.set("i", i.toString()), false, NumberSys.DEC);
            result += parseFloat(compiler.compile());
        }
        return result;
    }
}
