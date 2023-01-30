/* eslint-disable @typescript-eslint/no-redeclare */
import List from "../utils/List";
import Float from "../utils/Float";
import Is from "./Is";
// import Transformer from "./Transformer";

import { NumberSys, Operator } from "../types";
import type {
    ValueToken,
    ChildrenToken,
    NumberToken,
    FunctionToken
} from "../types";
// import type { NumberSymbol } from ".";

export default class Formula {
    public token: ChildrenToken;

    public constructor(token: ChildrenToken) {
        this.token = token;
    }

    public evaluate(): number {
        // // Logical Operator
        // for(let i = 0; i < this.operators.length; i++) {
        //     if(
        //         this.operators.get(i) === Operator.AND ||
        //         this.operators.get(i) === Operator.OR ||
        //         this.operators.get(i) === Operator.NAND ||
        //         this.operators.get(i) === Operator.NOR ||
        //         this.operators.get(i) === Operator.XOR ||
        //         this.operators.get(i) === Operator.LSH ||
        //         this.operators.get(i) === Operator.RSH
        //     ) {
        //         var a = parseInt(this.numbers.get(i));
        //         var b = parseInt(this.numbers.get(i + 1));
        //         this.numbers.remove(i + 1);

        //         switch(this.operators.get(i)) {
        //             case Operator.AND:
        //                 this.numbers.set(i, (a & b).toString());
        //                 break;
        //             case Operator.OR:
        //                 this.numbers.set(i, (a | b).toString());
        //                 break;
        //             case Operator.NAND:
        //                 this.numbers.set(i, (~(a & b)).toString());
        //                 break;
        //             case Operator.NOR:
        //                 this.numbers.set(i, (~(a | b)).toString());
        //                 break;
        //             case Operator.XOR:
        //                 this.numbers.set(i, (a ^ b).toString());
        //                 break;
        //             case Operator.LSH:
        //                 this.numbers.set(i, (a << b).toString());
        //                 break;
        //             case Operator.RSH:
        //                 this.numbers.set(i, (a >> b).toString());
        //                 break;
        //         }

        //         this.operators.remove(i);
        //         i--;
        //     }
        // }

        const root = this.token;
        var numbers: List<NumberToken> = new List();
        var operators: List<ValueToken<Operator>> = new List();

        for(let i = 0; i < root.children.length; i++) {
            var token = root.children[i];

            switch(token.type) {
                case "number":
                    numbers.add(token as NumberToken);
                    break;
                case "operator":
                    operators.add(token as ValueToken<Operator>);
                    break;
                case "bracket":
                    var value = new Formula(token as ChildrenToken).evaluate();
                    numbers.add({
                        type: "number",
                        value,
                        float: Is.float(value),
                        numberSys: NumberSys.DEC
                    });
                    break;
                case "function":
                    var { func, param } = token as FunctionToken;
                    var calculatedParam = [];
                    for(let i = 0; i < param.length; i++) {
                        calculatedParam.push(new Formula(param[i] as ChildrenToken).evaluate());
                    }
    
                    var value = func(...calculatedParam);
                    numbers.add({
                        type: "number",
                        value,
                        float: Is.float(value),
                        numberSys: NumberSys.DEC
                    });
                    break;
            }
        }
        
        for(let i = 0; i < operators.length; i++) {
            var operator = operators.get(i).value;
            
            if(operator === Operator.MUL || operator === Operator.DIV) {
                var a = numbers.get(i);
                var b = numbers.get(i + 1);
                var result: number;
    
                switch(operator) {
                    case Operator.MUL:
                        a.float || b.float
                        ? result = Float.multiply(a.value, b.value)
                        : result = a.value * b.value;
    
                        numbers.set(i, {
                            type: "number",
                            value: result,
                            float: Is.float(result),
                            numberSys: NumberSys.DEC
                        } as NumberToken);
                        numbers.remove(i + 1);
                        break;
                    case Operator.DIV:
                        if(b.value === 0) return NaN;
    
                        a.float || b.float
                        ? result = Float.divide(a.value, b.value)
                        : result = a.value / b.value;
    
                        numbers.set(i, {
                            type: "number",
                            value: result,
                            float: Is.float(result),
                            numberSys: NumberSys.DEC
                        } as NumberToken);
                        numbers.remove(i + 1);
                        break;
                }

                operators.remove(i);
                i--;
            }
        }

        for(let i = 0; i < operators.length; i++) {
            var operator = operators.get(i).value;
            
            if(operator === Operator.ADD || operator === Operator.SUB) {
                var a = numbers.get(i);
                var b = numbers.get(i + 1);
                var result: number;
    
                switch(operator) {
                    case Operator.ADD:
                        a.float || b.float
                        ? result = Float.add(a.value, b.value)
                        : result = a.value + b.value;
    
                        numbers.set(i, {
                            type: "number",
                            value: result,
                            float: Is.float(result),
                            numberSys: NumberSys.DEC
                        } as NumberToken);
                        numbers.remove(i + 1);
                        break;
                    case Operator.SUB:
                        a.float || b.float
                        ? result = Float.sub(a.value, b.value)
                        : result = a.value - b.value;
    
                        numbers.set(i, {
                            type: "number",
                            value: result,
                            float: Is.float(result),
                            numberSys: NumberSys.DEC
                        } as NumberToken);
                        numbers.remove(i + 1);
                        break;
                }

                operators.remove(i);
                i--;
            }
        }
        console.log(numbers.value);

        return numbers.get(0)?.value ?? NaN;
    }

    // public evaluateHex(): NumberSymbol {
    //     for(let i = 0; i < this.numbers.length; i++) {
    //         this.numbers.set(i, Transformer.hexToDec(this.numbers.get(i)));
    //     }
    //     return Transformer.decToHex(this.evaluate());
    // }

    // public evaluateDec(): NumberSymbol {
    //     return this.evaluate();
    // }

    // public evaluateOct(): NumberSymbol {
    //     for(let i = 0; i < this.numbers.length; i++) {
    //         this.numbers.set(i, Transformer.octToDec(this.numbers.get(i)));
    //     }
    //     return Transformer.decToOct(this.evaluate());
    // }

    // public evaluateBin(): NumberSymbol {
    //     for(let i = 0; i < this.numbers.length; i++) {
    //         this.numbers.set(i, Transformer.binToDec(this.numbers.get(i)));
    //     }
    //     return Transformer.decToBin(this.evaluate());
    // }
}
