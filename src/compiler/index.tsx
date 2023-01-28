/* eslint-disable @typescript-eslint/no-redeclare */
import List from "../utils/List";
import Formula from "./Formula";
import Is from "./Is";

import { Operator } from "../types";
import type { MathFunction } from "../types";

export type NumberSymbol = string;

export const functions: Map<string, MathFunction> = new Map([
    ["sin",        (x) => Math.sin(x)],
    ["cos",        (x) => Math.cos(x)],
    ["tan",        (x) => Math.tan(x)],
    ["cot",        (x) => 1 / Math.tan(x)],
    ["sec",        (x) => 1 / Math.cos(x)],
    ["csc",        (x) => 1 / Math.sin(x)],
    ["sin^{-1}",   (x) => Math.asin(x)],
    ["cos^{-1}",   (x) => Math.acos(x)],
    ["tan^{-1}",   (x) => Math.atan(x)],
    ["sinh",       (x) => Math.sinh(x)],
    ["cosh",       (x) => Math.cosh(x)],
    ["tanh",       (x) => Math.tanh(x)],
    ["coth",       (x) => 1 / Math.tanh(x)],
    ["text{sech}", (x) => 1 / Math.cosh(x)],
    ["text{csch}", (x) => 1 / Math.sinh(x)],
    ["ln",         (x) => Math.log(x)],
    ["lg",         (x) => Math.log10(x)],
    ["log_2",      (x) => Math.log2(x)],
    ["deg",        (x) => x * (Math.PI / 180)],
    ["√",          (x) => Math.sqrt(x)],
    ["^3√",        (x) => Math.cbrt(x)],
    ["%",          (x) => x / 100],
    ["text{not}",  (x) => ~x],
]);

export default class Compiler {
    private variables: Map<string, NumberSymbol>;
    private isProgrammingMode: boolean;

    private raw: string[];
    // private numberList: List<NumberSymbol> = new List([]);
    // private operatorList: List<Operator> = new List([]);

    private layer: number = 0;
    private inAbs: boolean = false;
    private currentFunction: MathFunction | null = null;
    private secondaryRaw: string[] = [];
    private hasError: boolean = false;
    
    public constructor(raw: string[], variables: Map<string, string>, isProgrammingMode: boolean = false) {
        this.raw = raw;
        this.variables = variables;
        this.isProgrammingMode = isProgrammingMode;

        // this.compile();
    }

    public compile(): Formula | void {
        var numbers = new List<NumberSymbol>();
        var operators = new List<Operator>();

        /**
         * Error handle
         */

        for(let i = 0; i < this.raw.length && !this.isProgrammingMode; i++) {
            var symbol = this.raw[i];
            var previous = this.raw[i - 1];
            if(
                (symbol === "e" || symbol === "\\pi" || Is.variable(symbol)) &&
                (previous === "e" || previous === "\\pi" || Is.variable(previous))
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
            if(
                this.isProgrammingMode &&
                symbol !== "\\text{not}(" // To avoid "\\text{not}(" being transformed to "not(" and causing error
            ) {
                symbol = Compiler.purifyNumber(symbol);
            }

            /**
             * Layers (inside brackets, absolute value)
             */

            if(this.layer > 0) { // in bracket or function
                if(Is.leftBracket(symbol) || Is.mathFunction(symbol)) this.layer++;
                if(Is.rightBracket(symbol)) this.layer--;

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

            if(Is.number(symbol, this.isProgrammingMode) || (Is.variable(symbol) && this.raw[1] !== "=")) { // number
                if(numbers.isEmpty()) numbers.add("");

                // Constant variable
                if(symbol === "e" && !this.isProgrammingMode) symbol = Math.E.toString();
                if(symbol === "\\pi") symbol = Math.PI.toString();

                // Variable
                if(Is.variable(symbol) && !this.isProgrammingMode) {
                    symbol = this.variables.get(symbol) ?? "NaN";
                }

                var target = numbers.length - 1;
                numbers.set(target, numbers.get(target) + symbol);
            } else if(Is.operator(symbol)) { // operator
                if(symbol === "-" && i === 0) {
                    numbers.add("-");
                    continue;
                }

                operators.add(symbol as Operator);
                numbers.add("");
            } else if(Is.leftBracket(symbol)) { // left bracket
                this.layer++;
            } else if(Is.rightBracket(symbol)) { // right bracket
                if(numbers.isEmpty()) numbers.add("");

                var secondaryCompiler = new Compiler(this.secondaryRaw, this.variables);
                var secondaryFormula = secondaryCompiler.compile();
                if(!secondaryFormula) {
                    this.hasError = true;
                    return;
                }

                var bracketResult = secondaryFormula.evaluate();
                var target = numbers.length - 1;
                if(this.currentFunction) {
                    numbers.set(target, this.currentFunction(parseFloat(bracketResult)).toString());
                    this.currentFunction = null;
                } else {
                    numbers.set(target, bracketResult);
                }

                this.secondaryRaw = [];
            } else if(symbol === "|") { // absolute value
                if(this.inAbs) {
                    if(numbers.isEmpty()) numbers.add("");

                    var secondaryCompiler = new Compiler(this.secondaryRaw, this.variables);
                    var secondaryFormula = secondaryCompiler.compile();
                    if(!secondaryFormula) {
                        this.hasError = true;
                        return;
                    }

                    var value = parseFloat(secondaryFormula.evaluate());
                    numbers.set(numbers.length - 1, Math.abs(value).toString());
                    
                    this.secondaryRaw = [];
                    this.inAbs = false;
                } else {
                    this.inAbs = true;
                }
            } else if(Is.mathFunction(symbol)) { // function
                var functionName = symbol.replace("\\", "").replace("(", "");
                if(!functions.has(functionName)) {
                    this.hasError = true;
                    return;
                }

                this.currentFunction = functions.get(functionName) ?? ((x) => x);
                this.layer++;
            } else if(symbol[0] === "^") { // sqrt or cbrt
                for(let j = 0; j < parseInt(symbol[1]) - 1; j++) {
                    operators.add(Operator.MUL);
                    numbers.add(numbers.get(numbers.length - 1));
                }
            }
        }

        return new Formula(numbers, operators);
    }

    public static purifyNumber(number: NumberSymbol): NumberSymbol {
        // e.g. "\\text{A}" -> "a"
        return number.replaceAll("\\text{", "").replaceAll("}", "").toLowerCase();
    }
}
