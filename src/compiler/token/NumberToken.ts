import Utils from "@/utils/Utils";
import { NumberSys } from "@/types";
import PowerableToken from "@/compiler/token/PowerableToken";
import { TokenType } from "@/compiler/token/Token";

import Is from "@/compiler/Is";

export default class NumberToken extends PowerableToken<number> {
    public readonly type: TokenType = TokenType.NUMBER;

    public float: boolean;

    public constructor(value: number, public numberSys: NumberSys) {
        super(value);

        this.float = Is.float(value);
    }

    /**
     * You must use `setValue()` to change the value of a number token,
     * Because in this way, the float property will be changed by the value.
     */
    public setValue(value: number) {
        this.value = value;
        this.float = Is.float(value);
    }

    public static create(numberStr: string, numberSys: NumberSys): NumberToken {
        var value = Utils.strToNum(numberStr, numberSys);
        var token = new NumberToken(value, numberSys === NumberSys.HEX ? NumberSys.DEC : numberSys);
        
        return token;
    }
}
