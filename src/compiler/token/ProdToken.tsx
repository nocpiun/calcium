import { NumberSys } from "../../types";
import Compiler from "../Compiler";
import { TokenType } from "./Token";
import DynamicToken from "./DynamicToken";

export default class ProdToken extends DynamicToken {
    public type: TokenType = TokenType.PROD;

    public i: number;
    public n: number;

    public constructor(i: number, n: number, raw: string[]) {
        super(raw);

        this.i = i;
        this.n = n;
    }

    public evaluate(): number {
        var result = 1;
        for(let i = this.i; i <= this.n; i++) {
            var compiler = new Compiler(this.raw, new Map([["i", i.toString()]]), false, NumberSys.DEC);
            result *= parseFloat(compiler.compile());
        }
        return result;
    }
}
