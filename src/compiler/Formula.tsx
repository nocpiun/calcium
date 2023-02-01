/* eslint-disable @typescript-eslint/no-redeclare */
import List from "../utils/List";
import Float from "../utils/Float";
import Is from "./Is";
import Transformer from "./Transformer";

import { NumberSys, Operator } from "../types";
import type {
    ValueToken,
    ChildrenToken,
    NumberToken,
    BracketToken,
    FunctionToken
} from "../types";
import Utils from "../utils/Utils";

export default class Formula {
    public token: ChildrenToken;

    public constructor(token: ChildrenToken) {
        this.token = token;
    }

    public evaluate(): number {
        const root = this.token;
        var numbers: List<NumberToken> = new List();
        var operators: List<ValueToken<Operator>> = new List();

        for(let i = 0; i < root.children.length; i++) {
            var token = root.children[i];

            switch(token.type) {
                case "number":
                    var numToken = token as NumberToken;
                    var transformedValue: number;
                    
                    switch(numToken.numberSys) {
                        case NumberSys.HEX:
                            transformedValue = parseFloat(Transformer.hexToDec(numToken.value.toString()));
                            break;
                        case NumberSys.DEC:
                            transformedValue = numToken.value;
                            break;
                        case NumberSys.OCT:
                            transformedValue = parseFloat(Transformer.octToDec(numToken.value.toString()));
                            break;
                        case NumberSys.BIN:
                            transformedValue = parseFloat(Transformer.binToDec(numToken.value.toString()));
                            break;
                    }

                    numbers.add({
                        type: "number",
                        value: transformedValue,
                        float: Is.float(transformedValue),
                        numberSys: NumberSys.DEC
                    });
                    break;
                case "operator":
                    operators.add(token as ValueToken<Operator>);
                    break;
                case "bracket":
                    var value = (token as BracketToken).factorial
                    ? Utils.factorial(new Formula(token as ChildrenToken).evaluate())
                    : new Formula(token as ChildrenToken).evaluate();
                    
                    numbers.add({
                        type: "number",
                        value,
                        float: Is.float(value),
                        numberSys: NumberSys.DEC
                    });
                    break;
                case "abs":
                    var value = Math.abs(new Formula(token as ChildrenToken).evaluate());
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

        // Logical Operator
        for(let i = 0; i < operators.length; i++) {
            var operator = operators.get(i).value;

            if(
                operator === Operator.AND ||
                operator === Operator.OR ||
                operator === Operator.NAND ||
                operator === Operator.NOR ||
                operator === Operator.XOR ||
                operator === Operator.LSH ||
                operator === Operator.RSH
            ) {
                var a = numbers.get(i);
                var b = numbers.get(i + 1);
                var result: number;
                
                switch(operator) {
                    case Operator.AND:
                        result = a.value & b.value;
                        break;
                    case Operator.OR:
                        result = a.value | b.value;
                        break;
                    case Operator.NAND:
                        result = ~(a.value & b.value);
                        break;
                    case Operator.NOR:
                        result = ~(a.value | b.value);
                        break;
                    case Operator.XOR:
                        result = a.value ^ b.value;
                        break;
                    case Operator.LSH:
                        result = a.value << b.value;
                        break;
                    case Operator.RSH:
                        result = a.value >> b.value;
                        break;
                }

                numbers.set(i, {
                    type: "number",
                    value: result,
                    float: Is.float(result),
                    numberSys: NumberSys.DEC
                } as NumberToken);
                numbers.remove(i + 1);
                operators.remove(i);
                i--;
            }
        }
        
        // Multiply & Divide
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
                        break;
                    case Operator.DIV:
                        a.float || b.float
                        ? result = Float.divide(a.value, b.value)
                        : result = a.value / b.value;
                        break;
                }

                numbers.set(i, {
                    type: "number",
                    value: result,
                    float: Is.float(result),
                    numberSys: NumberSys.DEC
                } as NumberToken);
                numbers.remove(i + 1);
                operators.remove(i);
                i--;
            }
        }

        // Add & Sub
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
                        break;
                    case Operator.SUB:
                        a.float || b.float
                        ? result = Float.sub(a.value, b.value)
                        : result = a.value - b.value;
                        break;
                }

                numbers.set(i, {
                    type: "number",
                    value: result,
                    float: Is.float(result),
                    numberSys: NumberSys.DEC
                } as NumberToken);
                numbers.remove(i + 1);
                operators.remove(i);
                i--;
            }
        }

        return numbers.get(0)?.value ?? NaN;
    }
}
