/* eslint-disable @typescript-eslint/no-redeclare */
import List from "../utils/List";
import Float from "./Float";
import Transformer from "./Transformer";
import Compute from "./Compute";

import { TokenType } from "./token/Token";
import PowerableToken from "./token/PowerableToken";
import ChildrenToken from "./token/ChildrenToken";
import RootToken from "./token/RootToken";
import NumberToken from "./token/NumberToken";
import OperatorToken from "./token/OperatorToken";
import BracketToken from "./token/BracketToken";
import AbsToken from "./token/AbsToken";
import FunctionToken from "./token/FunctionToken";
import DynamicToken from "./token/DynamicToken";

import { NumberSys, Operator } from "../types";

export default class Evaluator {
    public token: RootToken;

    public constructor(token: RootToken) {
        this.token = token;
    }

    public evaluate(): number {
        // Read token to make number list & operator list
        var [numbers, operators] = this.readToken();

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

                numbers.get(i).setValue(result);
                numbers.get(i).numberSys = NumberSys.DEC;
                numbers.remove(i + 1);
                operators.remove(i);
                i--;
            }
        }
        
        // Multiply & Divide
        var firstLoop = true;
        for(let i = 0; i < operators.length; i++) {
            var operator = operators.get(i).value;

            if(firstLoop && operators.get(i).isFirst && operator === Operator.SUB) {
                numbers.get(i).setValue(-numbers.get(i).value);
                operators.remove(i);
                i--;
                firstLoop = false;
                continue;
            }
            
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

                numbers.get(i).setValue(result);
                numbers.get(i).numberSys = NumberSys.DEC;
                numbers.remove(i + 1);
                operators.remove(i);
                i--;
            }
        }

        // Add & Sub
        var firstLoop = true;
        for(let i = 0; i < operators.length; i++) {
            var operator = operators.get(i).value;

            if(operator === Operator.ADD || operator === Operator.SUB) {
                if(firstLoop && operators.get(i).isFirst) {
                    numbers.get(i).setValue(-numbers.get(i).value);
                    operators.remove(i);
                    i--;
                    firstLoop = false;
                    continue;
                }

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

                numbers.get(i).setValue(result);
                numbers.get(i).numberSys = NumberSys.DEC;
                numbers.remove(i + 1);
                operators.remove(i);
                i--;
            }
        }

        var result = numbers.get(0)?.value ?? NaN;

        if(isNaN(result)) return NaN;
        return Float.calibrate(parseFloat(result.toFixed(14)));
    }

    private readToken(): [List<NumberToken>, List<OperatorToken>] {
        const root = this.token;

        var numbers: List<NumberToken> = new List();
        var operators: List<OperatorToken> = new List();

        for(let i = 0; i < root.getLength(); i++) {
            var token = root.getChild(i);
            var exponential = (token as PowerableToken).exponential ?? 1;

            switch(token.type) {
                case TokenType.NUMBER:
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

                    numbers.add(new NumberToken(
                        Compute.safePow(transformedValue, exponential),
                        NumberSys.DEC
                    ));
                    break;
                case TokenType.OPERATOR:
                    operators.add(token as OperatorToken);
                    break;
                case TokenType.BRACKET:
                    var rawValue = new Evaluator(token as BracketToken).evaluate();
                    var value = (token as BracketToken).factorial
                    ? Compute.factorial(rawValue)
                    : rawValue;
                    
                    numbers.add(new NumberToken(
                        Compute.safePow(value, exponential),
                        NumberSys.DEC
                    ));
                    break;
                case TokenType.ABS:
                    var rawValue = Math.abs(new Evaluator(token as AbsToken).evaluate());
                    var value = (token as AbsToken).factorial
                    ? Compute.factorial(rawValue)
                    : rawValue;

                    numbers.add(new NumberToken(
                        Compute.safePow(value, exponential),
                        NumberSys.DEC
                    ));
                    break;
                case TokenType.FUNCTION:
                    var { func, param } = token as FunctionToken;
                    var calculatedParam = [];
                    for(let i = 0; i < param.length; i++) {
                        calculatedParam.push(new Evaluator(param[i] as ChildrenToken).evaluate());
                    }

                    var value = Float.calibrate(parseFloat(func(...calculatedParam).toFixed(14)));
                    numbers.add(new NumberToken(
                        Compute.safePow(value, exponential),
                        NumberSys.DEC
                    ));
                    break;
                case TokenType.SIGMA:
                case TokenType.INT:
                    var value = Float.calibrate((token as DynamicToken).evaluate());
                    numbers.add(new NumberToken(
                        Compute.safePow(value, exponential),
                        NumberSys.DEC
                    ));
                    break;
            }
        }

        return [numbers, operators];
    }
}
