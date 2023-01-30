/* eslint-disable @typescript-eslint/no-redeclare */
import Formula from "./Formula";
import Is from "./Is";

import { Operator, NumberSys } from "../types";
import type {
    MathFunction,
    Token,
    ValueToken,
    ChildrenToken,
    RootToken,
    NumberToken,
    FunctionToken
} from "../types";
import Utils from "../utils/Utils";

export type NumberSymbol = string;

export const functions: Map<string, MathFunction> = new Map([
    ["sin",        [(x) => Math.sin(x),          1]],
    ["cos",        [(x) => Math.cos(x),          1]],
    ["tan",        [(x) => Math.tan(x),          1]],
    ["cot",        [(x) => 1 / Math.tan(x),      1]],
    ["sec",        [(x) => 1 / Math.cos(x),      1]],
    ["csc",        [(x) => 1 / Math.sin(x),      1]],
    ["sin^{-1}",   [(x) => Math.asin(x),         1]],
    ["cos^{-1}",   [(x) => Math.acos(x),         1]],
    ["tan^{-1}",   [(x) => Math.atan(x),         1]],
    ["sinh",       [(x) => Math.sinh(x),         1]],
    ["cosh",       [(x) => Math.cosh(x),         1]],
    ["tanh",       [(x) => Math.tanh(x),         1]],
    ["coth",       [(x) => 1 / Math.tanh(x),     1]],
    ["text{sech}", [(x) => 1 / Math.cosh(x),     1]],
    ["text{csch}", [(x) => 1 / Math.sinh(x),     1]],
    ["ln",         [(x) => Math.log(x),          1]],
    ["lg",         [(x) => Math.log10(x),        1]],
    ["log_2",      [(x) => Math.log2(x),         1]],
    ["deg",        [(x) => x * (Math.PI / 180),  1]],
    ["√",          [(x) => Math.sqrt(x),         1]],
    ["^3√",        [(x) => Math.cbrt(x),         1]],
    ["%",          [(x) => x / 100,              1]],
    ["text{not}",  [(x) => ~x,                   1]],
    ["text{mean}", [(...n) => Utils.mean(...n), -1]],
]);

export default class Compiler {
    private variables: Map<string, NumberSymbol>;
    private isProgrammingMode: boolean;

    private raw: string[];

    private layer: number = 0;
    private inAbs: boolean = false;
    private currentFunction: MathFunction | null = null;
    private secondaryRaw: string[] = [];
    private hasError: boolean = false;
    
    public constructor(raw: string[], variables: Map<string, string>, isProgrammingMode: boolean = false) {
        this.raw = raw;
        this.variables = variables;
        this.isProgrammingMode = isProgrammingMode;
    }

    public tokenize(): RootToken | void {
        var root: RootToken = {
            type: "root",
            children: []
        };

        var tempNumber: NumberSymbol = "";
        var tempParamRaw: NumberSymbol[] = [];
        var tempParamList: Token[] = [];

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

                if(
                    (
                        this.layer >= 1 ||
                        (
                            Is.rightBracket(symbol) &&
                            this.layer === 0
                        )
                    ) &&
                    this.currentFunction
                ) {
                    if(
                        (symbol === "," && this.layer === 1) ||
                        (Is.rightBracket(symbol) && this.layer === 0)
                    ) {
                        var tokenized = new Compiler(tempParamRaw, this.variables).tokenize();
                        if(!tokenized) {
                            this.hasError = true;
                            return;
                        }

                        tempParamList.push(tokenized);
                        tempParamRaw = [];
                    } else {
                        tempParamRaw.push(symbol);
                    }
                    if(!(Is.rightBracket(symbol) && this.layer === 0)) continue;
                }

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
                // Constant variable
                if(symbol === "e" && !this.isProgrammingMode) symbol = Math.E.toString();
                if(symbol === "\\pi") symbol = Math.PI.toString();

                // Variable
                if(Is.variable(symbol) && !this.isProgrammingMode) {
                    symbol = this.variables.get(symbol) ?? "NaN";
                }

                tempNumber += symbol;

                if(i === this.raw.length - 1) {
                    root.children.push({
                        type: "number",
                        value: parseFloat(tempNumber),
                        float: Is.float(parseFloat(tempNumber)),
                        numberSys: NumberSys.DEC
                    } as NumberToken);
                }
            } else if(Is.operator(symbol)) { // operator
                if(symbol === "-" && i === 0) {
                    tempNumber += "-";
                    continue;
                }
                if(i !== 0 && tempNumber !== "") {
                    root.children.push({
                        type: "number",
                        value: parseFloat(tempNumber),
                        float: Is.float(parseFloat(tempNumber)),
                        numberSys: NumberSys.DEC
                    } as NumberToken);
                }
                root.children.push({
                    type: "operator",
                    value: symbol as Operator
                } as ValueToken<Operator>);

                tempNumber = "";
            } else if(Is.leftBracket(symbol)) { // left bracket
                this.layer++;
            } else if(Is.rightBracket(symbol)) { // right bracket
                var secondaryCompiler = new Compiler(this.secondaryRaw, this.variables);
                var bracketContent = secondaryCompiler.tokenize();
                if(!bracketContent) {
                    this.hasError = true;
                    return;
                }

                if(this.currentFunction) {
                    root.children.push({
                        type: "function",
                        func: this.currentFunction[0],
                        param: tempParamList
                    } as FunctionToken);
                    tempParamRaw = [];
                    tempParamList = [];
                    this.currentFunction = null;
                } else {
                    root.children.push({
                        type: "bracket",
                        children: bracketContent.children
                    } as ChildrenToken);
                }

                this.secondaryRaw = [];
            } else if(symbol === "|") { // absolute value
                if(this.inAbs) {
                    var secondaryCompiler = new Compiler(this.secondaryRaw, this.variables);
                    var absContent = secondaryCompiler.tokenize();
                    if(!absContent) {
                        this.hasError = true;
                        return;
                    }

                    root.children.push({
                        type: "abs",
                        children: absContent.children
                    } as ChildrenToken);
                    
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

                this.currentFunction = functions.get(functionName) ?? [((x) => x), 1];
                this.layer++;
            } else if(symbol[0] === "^") { // pow
                var targetNumberToken: NumberToken = {
                    type: "number",
                    value: parseFloat(tempNumber),
                    float: Is.float(parseFloat(tempNumber)),
                    numberSys: NumberSys.DEC
                };
                root.children.push(targetNumberToken);

                for(let j = 0; j < parseInt(symbol[1]) - 1; j++) {
                    root.children.push({
                        type: "operator",
                        value: Operator.MUL
                    } as ValueToken<Operator>);
                    root.children.push(targetNumberToken);
                }
            }
        }

        console.log(root);
        return root;
    }

    public compile(): NumberSymbol {
        var tokenized = this.tokenize();
        
        if(tokenized && !this.hasError) return new Formula(tokenized).evaluate().toString();
        return "NaN";
    }

    public static purifyNumber(number: NumberSymbol): NumberSymbol {
        // e.g. "\\text{A}" -> "a"
        return number.replaceAll("\\text{", "").replaceAll("}", "").toLowerCase();
    }
}
