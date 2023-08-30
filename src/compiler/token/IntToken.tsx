import DynamicToken from "./DynamicToken";
import { TokenType } from "./Token";
import Compiler from "../Compiler";
import { NumberSys } from "../../types";

const dx: number = .001;

export default class IntToken extends DynamicToken {
    public type: TokenType = TokenType.INT;

    public a: number;
    public b: number;

    public constructor(a: number, b: number, raw: string[]) {
        super(raw);

        this.a = a;
        this.b = b;
    }

    public evaluate(): number {
        var result = 0;
        for(let i = this.a; i <= this.b; i += dx) {
            const varMap = new Map([
                ["dx", dx.toString()],
                ["x", i.toString()]
            ]);
            var compiler = new Compiler(this.raw, varMap, false, NumberSys.DEC);
            result += parseFloat(compiler.compile());
        }
        return result;
    }
}
