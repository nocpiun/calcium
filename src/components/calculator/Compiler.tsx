/* eslint-disable @typescript-eslint/no-redeclare */
import List from "../../utils/List";
import Float from "../../utils/Float";
import { Operator } from "../../types";

export default class Compiler {
    private raw: string[];
    private numberList: List<string> = new List<string>([]);
    private operatorList: List<Operator> = new List<Operator>([]);

    private layer: number = 0;
    private inAbs: boolean = false;
    private secondaryRaw: string[] = [];
    
    public constructor(raw: string[]) {
        this.raw = raw;
        this.compile();
    }

    private compile(): void {
        for(let i = 0; i < this.raw.length; i++) {
            var symbol = this.raw[i];

            if(this.layer > 0) { // in bracket
                if(symbol === "(") this.layer++;
                if(symbol === ")") this.layer--;

                if(this.layer > 0) {
                    this.secondaryRaw.push(symbol);
                    continue;
                }
            }

            if(this.inAbs && symbol !== "|") { // in absolute value
                this.secondaryRaw.push(symbol);
                continue;
            }

            if(this.isNumber(symbol)) { // number
                if(this.numberList.isEmpty()) this.numberList.add("");
                var target = this.numberList.length - 1;

                this.numberList.set(target, this.numberList.get(target) + symbol);
            } else if(this.isOperator(symbol)) { // operator
                switch(symbol) {
                    case "+":
                        this.operatorList.add(Operator.ADD);
                        break;
                    case "-":
                        this.operatorList.add(Operator.SUB);
                        break;
                    case "×":
                        this.operatorList.add(Operator.MUL);
                        break;
                    case "/":
                        this.operatorList.add(Operator.DIV);
                        break;
                }

                this.numberList.add("");
            } else if(symbol === "(") { // left bracket
                this.layer++;
            } else if(symbol === ")") { // right bracket
                if(this.numberList.isEmpty()) this.numberList.add("");
                this.numberList.set(this.numberList.length - 1, new Compiler(this.secondaryRaw).run());

                this.secondaryRaw = [];
            } else if(symbol === "|") { // absolute value
                if(this.inAbs) {
                    if(this.numberList.isEmpty()) this.numberList.add("");

                    var value = parseFloat(new Compiler(this.secondaryRaw).run());
                    this.numberList.set(this.numberList.length - 1, Math.abs(value).toString());
                    
                    this.secondaryRaw = [];
                    this.inAbs = false;
                } else {
                    this.inAbs = true;
                }
            }
        }
    }

    private isNumber(symbol: string): boolean {
        const number = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "."];
        return number.indexOf(symbol) > -1;
    }

    private isOperator(symbol: string): boolean {
        const operator = ["+", "-", "×", "/"];
        return operator.indexOf(symbol) > -1;
    }

    public run(): string {
        // Multiply & Divide
        for(let i = 0; i < this.operatorList.length; i++) {
            if(
                this.operatorList.get(i) === Operator.MUL ||
                this.operatorList.get(i) === Operator.DIV
            ) {
                var a = parseFloat(this.numberList.get(i));
                var b = parseFloat(this.numberList.get(i + 1));
                this.numberList.remove(i + 1);

                switch(this.operatorList.get(i)) {
                    case Operator.MUL:
                        this.numberList.get(i).indexOf(".") === -1
                        ? this.numberList.set(i, (a * b).toString())
                        : this.numberList.set(i, Float.multiply(a, b).toString());
                        break;
                    case Operator.DIV:
                        this.numberList.get(i).indexOf(".") === -1
                        ? this.numberList.set(i, (a / b).toString())
                        : this.numberList.set(i, Float.divide(a, b).toString());
                        break;
                }

                this.operatorList.remove(i);
                i--;
            }
        }

        // Plus & Minus
        for(let j = 0; j < this.operatorList.length; j++) {
            var a = parseFloat(this.numberList.get(j));
            var b = parseFloat(this.numberList.get(j + 1));
            this.numberList.remove(j + 1);

            switch(this.operatorList.get(j)) {
                case Operator.ADD:
                    this.numberList.get(j).indexOf(".") === -1
                    ? this.numberList.set(j, (a + b).toString())
                    : this.numberList.set(j, Float.add(a, b).toString());
                    break;
                case Operator.SUB:
                    this.numberList.get(j).indexOf(".") === -1
                    ? this.numberList.set(j, (a - b).toString())
                    : this.numberList.set(j, Float.sub(a, b).toString());
                    break;
            }

            this.operatorList.remove(j);
            j--;
        }

        return this.numberList.get(0);
    }
}
