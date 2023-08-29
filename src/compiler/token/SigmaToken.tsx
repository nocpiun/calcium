import { NumberSys } from "../../types";
import Compiler from "../Compiler";
import Token, { TokenType } from "./Token";

export default class SigmaToken extends Token<void> {
    public type: TokenType = TokenType.SIGMA;

    public i: number;
    public n: number;
    public raw: string[];

    public constructor(i: number, n: number, raw: string[]) {
        super();

        this.i = i;
        this.n = n;
        this.raw = raw;
    }

    public evaluate(): number {
        var result = 0;
        for(let i = this.i; i <= this.n; i++) {
            var compiler = new Compiler(this.raw, new Map([["i", i.toString()]]), false, NumberSys.DEC);
            result += parseFloat(compiler.compile());
        }
        return result;
    }
}
