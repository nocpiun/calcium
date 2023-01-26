/* eslint-disable @typescript-eslint/no-redeclare */
import List from "./List";
import Float from "./Float";
import { Operator, MathFunction } from "../types";

export default class Compiler {
    public static functions: Map<string, MathFunction> = new Map([
        ["sin",      (x) => Math.sin(x)],
        ["cos",      (x) => Math.cos(x)],
        ["tan",      (x) => Math.tan(x)],
        ["cot",      (x) => 1 / Math.tan(x)],
        ["sec",      (x) => 1 / Math.cos(x)],
        ["csc",      (x) => 1 / Math.sin(x)],
        ["sin^{-1}", (x) => Math.asin(x)],
        ["cos^{-1}", (x) => Math.acos(x)],
        ["tan^{-1}", (x) => Math.atan(x)],
        ["sinh",     (x) => Math.sinh(x)],
        ["cosh",     (x) => Math.cosh(x)],
        ["tanh",     (x) => Math.tanh(x)],
        ["coth",     (x) => 1 / Math.tanh(x)],
        ["sech",     (x) => 1 / Math.cosh(x)],
        ["csch",     (x) => 1 / Math.sinh(x)],
        ["ln",       (x) => Math.log(x)],
        ["lg",       (x) => Math.log10(x)],
        ["log_2",    (x) => Math.log2(x)],
        ["deg",      (x) => x * (Math.PI / 180)],
        ["√",        (x) => Math.sqrt(x)],
        ["^3√",      (x) => Math.cbrt(x)],
        ["%",        (x) => x / 100],
    ]);
    private variables: Map<string, string>;

    private raw: string[];
    private numberList: List<string> = new List<string>([]);
    private operatorList: List<Operator> = new List<Operator>([]);

    private layer: number = 0;
    private inAbs: boolean = false;
    private currentFunction: MathFunction | null = null;
    private secondaryRaw: string[] = [];
    private hasError: boolean = false;
    
    public constructor(raw: string[], variables: Map<string, string>) {
        this.raw = raw;
        this.variables = variables;

        this.compile();
    }

    public static isNumber(symbol: string): boolean {
        const number = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "e", "\\pi", "."];
        return number.indexOf(symbol) > -1;
    }

    public static isOperator(symbol: string): boolean {
        const operator = ["+", "-", "×", "/"];
        return operator.indexOf(symbol) > -1;
    }

    public static isLeftBracket(symbol: string): boolean {
        const leftBracket = ["(", "["];
        return leftBracket.indexOf(symbol) > -1;
    }

    public static isRightBracket(symbol: string): boolean {
        const rightBracket = [")", "]"];
        return rightBracket.indexOf(symbol) > -1;
    }

    public static isFunction(symbol: string): boolean {
        const specialFunction = ["√(", "^3√("];
        return (symbol[0] === "\\" && symbol[symbol.length - 1] === "(") || specialFunction.indexOf(symbol) > -1;
    }

    public static isVariable(symbol: string): boolean {
        const variableSymbol = [
            "a", "b", "c", "d", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
            "\\alpha", "\\beta", "\\gamma", "\\delta", "\\epsilon", "\\zeta", "\\eta", "\\theta", "\\iota", "\\kappa", "\\lambda",
            "\\mu", "\\nu", "\\xi", "\\omicron", "\\rho", "\\sigma", "\\tau", "\\upsilon", "\\phi", "\\chi", "\\psi", "\\omega",
            "\\Delta"
        ];
        return variableSymbol.indexOf(symbol) > -1;
    }

    private compile(): void {
        /**
         * Error handle
         */

        for(let i = 0; i < this.raw.length; i++) {
            var symbol = this.raw[i];
            var previous = this.raw[i - 1];
            if(
                (symbol === "e" || symbol === "\\pi" || Compiler.isVariable(symbol)) &&
                (previous === "e" || previous === "\\pi" || Compiler.isVariable(previous))
            ) {
                this.hasError = true;
                return;
            }
        }

        /**
         * Resolve raw input content
         */

        for(let i = 0; i < this.raw.length; i++) {
            var symbol = this.raw[i];

            /**
             * Layers (inside brackets, absolute value)
             */

            if(this.layer > 0) { // in bracket or function
                if(Compiler.isLeftBracket(symbol) || Compiler.isFunction(symbol)) this.layer++;
                if(Compiler.isRightBracket(symbol)) this.layer--;

                if(this.layer > 0) {
                    this.secondaryRaw.push(symbol);
                    continue;
                }
            }

            if(this.inAbs && symbol !== "|") { // in absolute value
                this.secondaryRaw.push(symbol);
                continue;
            }

            /**
             * Main
             */

            if(Compiler.isNumber(symbol) || (Compiler.isVariable(symbol) && this.raw[1] !== "=")) { // number
                if(this.numberList.isEmpty()) this.numberList.add("");

                // Constant variable
                if(symbol === "e") symbol = Math.E.toString();
                if(symbol === "\\pi") symbol = Math.PI.toString();

                // Variable
                if(Compiler.isVariable(symbol)) {
                    symbol = this.variables.get(symbol) ?? "NaN";
                }

                var target = this.numberList.length - 1;
                this.numberList.set(target, this.numberList.get(target) + symbol);
            } else if(Compiler.isOperator(symbol)) { // operator
                if(symbol === "-" && i === 0) {
                    this.numberList.add("-");
                    continue;
                }

                this.operatorList.add(symbol as Operator);
                this.numberList.add("");
            } else if(Compiler.isLeftBracket(symbol)) { // left bracket
                this.layer++;
            } else if(Compiler.isRightBracket(symbol)) { // right bracket
                if(this.numberList.isEmpty()) this.numberList.add("");

                var bracketResult = new Compiler(this.secondaryRaw, this.variables).run();
                var target = this.numberList.length - 1;
                if(this.currentFunction) {
                    this.numberList.set(target, this.currentFunction(parseFloat(bracketResult)).toString());
                    this.currentFunction = null;
                } else {
                    this.numberList.set(target, bracketResult);
                }

                this.secondaryRaw = [];
            } else if(symbol === "|") { // absolute value
                if(this.inAbs) {
                    if(this.numberList.isEmpty()) this.numberList.add("");

                    var value = parseFloat(new Compiler(this.secondaryRaw, this.variables).run());
                    this.numberList.set(this.numberList.length - 1, Math.abs(value).toString());
                    
                    this.secondaryRaw = [];
                    this.inAbs = false;
                } else {
                    this.inAbs = true;
                }
            } else if(Compiler.isFunction(symbol)) { // function
                var functionName = symbol.replace("\\", "").replace("(", "");
                if(!Compiler.functions.has(functionName)) {
                    this.hasError = true;
                    return;
                }

                this.currentFunction = Compiler.functions.get(functionName) ?? ((x) => x);
                this.layer++;
            } else if(symbol[0] === "^") { // sqrt or cbrt
                for(let j = 0; j < parseInt(symbol[1]) - 1; j++) {
                    this.operatorList.add(Operator.MUL);
                    this.numberList.add(this.numberList.get(this.numberList.length - 1));
                }
            }
        }
    }

    public run(): string {
        if(this.hasError) return "NaN";

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
                        if(b === 0) return "NaN";

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
