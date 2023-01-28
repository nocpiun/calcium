/* eslint-disable @typescript-eslint/no-redeclare */
import List from "../utils/List";
import Float from "../utils/Float";
import Transformer from "./Transformer";

import { Operator } from "../types";
import type { NumberSymbol } from ".";

export default class Formula {
    public numbers: List<NumberSymbol>;
    public operators: List<Operator>;

    public constructor(numbers: List<NumberSymbol>, operators: List<Operator>) {
        this.numbers = numbers;
        this.operators = operators;
    }

    public evaluate(): NumberSymbol {
        // Logical Operator
        for(let i = 0; i < this.operators.length; i++) {
            if(
                this.operators.get(i) === Operator.AND ||
                this.operators.get(i) === Operator.OR ||
                this.operators.get(i) === Operator.NAND ||
                this.operators.get(i) === Operator.NOR ||
                this.operators.get(i) === Operator.XOR ||
                this.operators.get(i) === Operator.LSH ||
                this.operators.get(i) === Operator.RSH
            ) {
                var a = parseInt(this.numbers.get(i));
                var b = parseInt(this.numbers.get(i + 1));
                this.numbers.remove(i + 1);

                switch(this.operators.get(i)) {
                    case Operator.AND:
                        this.numbers.set(i, (a & b).toString());
                        break;
                    case Operator.OR:
                        this.numbers.set(i, (a | b).toString());
                        break;
                    case Operator.NAND:
                        this.numbers.set(i, (~(a & b)).toString());
                        break;
                    case Operator.NOR:
                        this.numbers.set(i, (~(a | b)).toString());
                        break;
                    case Operator.XOR:
                        this.numbers.set(i, (a ^ b).toString());
                        break;
                    case Operator.LSH:
                        this.numbers.set(i, (a << b).toString());
                        break;
                    case Operator.RSH:
                        this.numbers.set(i, (a >> b).toString());
                        break;
                }

                this.operators.remove(i);
                i--;
            }
        }

        // Multiply & Divide
        for(let i = 0; i < this.operators.length; i++) {
            if(
                this.operators.get(i) === Operator.MUL ||
                this.operators.get(i) === Operator.DIV
            ) {
                var a = parseFloat(this.numbers.get(i));
                var b = parseFloat(this.numbers.get(i + 1));
                this.numbers.remove(i + 1);

                switch(this.operators.get(i)) {
                    case Operator.MUL:
                        this.numbers.get(i).indexOf(".") === -1
                        ? this.numbers.set(i, (a * b).toString())
                        : this.numbers.set(i, Float.multiply(a, b).toString());
                        break;
                    case Operator.DIV:
                        if(b === 0) return "NaN";

                        this.numbers.get(i).indexOf(".") === -1
                        ? this.numbers.set(i, (a / b).toString())
                        : this.numbers.set(i, Float.divide(a, b).toString());
                        break;
                }

                this.operators.remove(i);
                i--;
            }
        }

        // Plus & Minus
        for(let j = 0; j < this.operators.length; j++) {
            var a = parseFloat(this.numbers.get(j));
            var b = parseFloat(this.numbers.get(j + 1));
            this.numbers.remove(j + 1);

            switch(this.operators.get(j)) {
                case Operator.ADD:
                    this.numbers.get(j).indexOf(".") === -1
                    ? this.numbers.set(j, (a + b).toString())
                    : this.numbers.set(j, Float.add(a, b).toString());
                    break;
                case Operator.SUB:
                    this.numbers.get(j).indexOf(".") === -1
                    ? this.numbers.set(j, (a - b).toString())
                    : this.numbers.set(j, Float.sub(a, b).toString());
                    break;
            }

            this.operators.remove(j);
            j--;
        }

        return this.numbers.get(0);
    }

    public evaluateHex(): NumberSymbol {
        console.log(this.numbers.value);
        for(let i = 0; i < this.numbers.length; i++) {
            this.numbers.set(i, Transformer.hexToDec(this.numbers.get(i)));
        }
        return Transformer.decToHex(this.evaluate());
    }

    public evaluateDec(): NumberSymbol {
        return this.evaluate();
    }

    public evaluateOct(): NumberSymbol {
        for(let i = 0; i < this.numbers.length; i++) {
            this.numbers.set(i, Transformer.octToDec(this.numbers.get(i)));
        }
        return Transformer.decToOct(this.evaluate());
    }

    public evaluateBin(): NumberSymbol {
        for(let i = 0; i < this.numbers.length; i++) {
            this.numbers.set(i, Transformer.binToDec(this.numbers.get(i)));
        }
        return Transformer.decToBin(this.evaluate());
    }
}
