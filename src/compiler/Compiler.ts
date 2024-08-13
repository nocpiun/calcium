/* eslint-disable @typescript-eslint/no-redeclare */
import Evaluator from "@/compiler/Evaluator";
import Is from "@/compiler/Is";
import MathKits from "@/compiler/MathKits";

import Token, { TokenType } from "@/compiler/token/Token";
import PowerableToken from "@/compiler/token/PowerableToken";
import RootToken from "@/compiler/token/RootToken";
import NumberToken from "@/compiler/token/NumberToken";
import OperatorToken from "@/compiler/token/OperatorToken";
import BracketToken from "@/compiler/token/BracketToken";
import AbsToken from "@/compiler/token/AbsToken";
import FunctionToken from "@/compiler/token/FunctionToken";
import SumToken from "@/compiler/token/SumToken";
import IntToken from "@/compiler/token/IntToken";
import ProdToken from "@/compiler/token/ProdToken";
import VariableToken from "@/compiler/token/VariableToken";

import { functions, constants } from "@/global";
import { Operator, NumberSys } from "@/types";

export type NumberSymbol = string;

export default class Compiler {
    private root: RootToken;

    private layer: number = 0;
    private inAbs: boolean = false;
    private currentFunction: string | null = null;
    private secondaryRaw: string[] = [];
    private hasError: boolean = false;

    private tempParamRaw: NumberSymbol[] = [];
    private tempParamList: Token[] = [];
    
    private sigmaI: number = -1;
    private sigmaN: number = -1;
    private intA: number = NaN;
    private intB: number = NaN;
    private prodI: number = -1;
    private prodN: number = -1;
    
    public constructor(
        private raw: string[],
        private variables: Map<string, string> = new Map([]),
        private isProgrammingMode: boolean = false,
        private numberSys: NumberSys = NumberSys.DEC
    ) {
        this.root = new RootToken([]);
    }

    public compile(): NumberSymbol {
        var tokenized = this.tokenize();
        
        if(tokenized && !this.hasError) return new Evaluator(tokenized, this.variables).evaluate().toString();
        return "NaN";
    }

    public tokenize(): RootToken | void {

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
             * 
             * Mountain of shit be like:
             */
            // MARK: Layers

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
                        var tokenized = new Compiler(this.tempParamRaw, this.variables, this.isProgrammingMode, this.numberSys).tokenize();
                        if(!tokenized) {
                            this.hasError = true;
                            return;
                        }

                        this.tempParamList.push(tokenized);
                        this.tempParamRaw = [];
                    } else {
                        this.tempParamRaw.push(symbol);
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

            if(Is.number(symbol, this.isProgrammingMode) || (Is.variable(symbol) && this.raw[1] !== "=")) { // MARK: Number

                // Variable and Constant
                if((Is.variable(symbol) || Is.constant(symbol)) && !this.isProgrammingMode) {
                    if(
                        Is.number(this.raw[i - 1], this.isProgrammingMode) ||
                        Is.variable(this.raw[i - 1]) ||
                        Is.constant(this.raw[i - 1]) ||
                        (this.root.getLength() > 0 && this.root.getLastChild().type === TokenType.NUMBER) // Process something like `2^2*a`
                    ) {
                        this.pushOperator(Operator.MUL);
                        this.pushVariable(symbol);

                        // pow
                        this.pushExponential(i) && i++;
                    } else {
                        this.pushVariable(symbol);

                        if(Is.variable(symbol) && Is.number(this.raw[i + 1], this.isProgrammingMode)) {
                            this.pushOperator(Operator.MUL);
                        }
                    }
                    continue;
                }

                var tempNumber: NumberSymbol = symbol;
                while(
                    i + 1 < this.raw.length &&
                    Is.number(Compiler.purifyNumber(this.raw[i + 1]), this.isProgrammingMode) &&
                    !Is.constant(this.raw[i + 1])
                ) {
                    tempNumber += Compiler.purifyNumber(this.raw[i + 1]);
                    i++;
                }
                if(tempNumber !== "NaN") this.pushNumber(tempNumber);

            } else if(Is.operator(symbol)) { // MARK: Operator

                this.pushOperator(symbol as Operator, i === 0);

            } else if(Is.leftBracket(symbol)) { // MARK: Left Bracket

                // Process something like `3(5-2)`
                if(i !== 0 && !Is.operator(this.raw[i - 1])) {
                    this.pushOperator(Operator.MUL);
                }
                
                this.layer++;

            } else if(Is.rightBracket(symbol)) { // MARK: Right Bracket

                if(this.sigmaI > -1 && this.sigmaN > -1) { // sum (sigma)
                    this.root.add(new SumToken(this.sigmaI, this.sigmaN, this.secondaryRaw, this.variables));
                    continue;
                }

                if(this.prodI > -1 && this.prodN > -1) { // prod
                    this.root.add(new ProdToken(this.prodI, this.prodN, this.secondaryRaw, this.variables));
                    continue;
                }

                if(!isNaN(this.intA) && !isNaN(this.intB)) { // integral
                    this.root.add(new IntToken(this.intA, this.intB, this.secondaryRaw, this.variables));
                    continue;
                }

                var secondaryCompiler = new Compiler(this.secondaryRaw, this.variables, this.isProgrammingMode, this.numberSys);
                var bracketContent = secondaryCompiler.tokenize();
                if(!bracketContent) {
                    this.hasError = true;
                    return;
                }

                if(this.currentFunction) {
                    this.root.add(new FunctionToken(this.currentFunction, this.tempParamList));
                    this.tempParamRaw = [];
                    this.tempParamList = [];
                    this.currentFunction = null;
                } else if(this.raw[i + 1] === "!") {
                    this.root.add(new BracketToken(bracketContent.value, true));
                    i++;
                } else {
                    this.root.add(new BracketToken(bracketContent.value, false));
                }

                this.secondaryRaw = [];

                // pow (after right bracket or factorial sign)
                // (i + di) is where the "^x" sign is
                if(this.pushExponential(i)) {
                    i++;
                    continue;
                }

                // Process something like `(5-2)3`
                if(
                    i + 1 < this.raw.length &&
                    !Is.operator(this.raw[i + 1]) &&

                    // In the formula like `(5-2)(5-3)` or `sin(2)cos(2)`, the operator
                    // between two items will be handled by the left bracket of `(5-3)`.
                    // So here should do nothing.
                    !Is.leftBracket(this.raw[i + 1]) &&
                    !Is.mathFunction(this.raw[i + 1])
                ) {
                    this.pushOperator(Operator.MUL);
                }

            } else if(symbol === "|") { // MARK: Absolute Value

                if(this.inAbs) {
                    var secondaryCompiler = new Compiler(this.secondaryRaw, this.variables, this.isProgrammingMode, this.numberSys);
                    var absContent = secondaryCompiler.tokenize();
                    if(!absContent) {
                        this.hasError = true;
                        return;
                    }

                    this.raw[i + 1] === "!"
                    ? this.root.add(new AbsToken(absContent.value, true)) // The factorial will be processed by the Evaluator
                    : this.root.add(new AbsToken(absContent.value, false));

                    // pow
                    this.pushExponential(i) && i++;
                    
                    this.secondaryRaw = [];
                    this.inAbs = false;
                } else {
                    this.inAbs = true;
                }

            } else if(symbol.indexOf("\\Sigma") > -1) { // MARK: Sum (sigma)

                if(i !== 0 && (Is.number(this.raw[i - 1], this.isProgrammingMode) || Is.constant(this.raw[i - 1]) || Is.variable(this.raw[i - 1]))) {
                    this.pushOperator(Operator.MUL);
                }

                const [sigmaI, sigmaN] = this.proResolve(symbol);
                this.sigmaI = sigmaI;
                this.sigmaN = sigmaN;

                this.layer++;
            
            } else if(symbol.indexOf("\\Pi") > -1) { // MARK: Product

                if(i !== 0 && (Is.number(this.raw[i - 1], this.isProgrammingMode) || Is.constant(this.raw[i - 1]) || Is.variable(this.raw[i - 1]))) {
                    this.pushOperator(Operator.MUL);
                }

                const [prodI, prodN] = this.proResolve(symbol);
                this.prodI = prodI;
                this.prodN = prodN;

                this.layer++;
            
            } else if(symbol.indexOf("\\smallint") > -1) { // MARK: Integral

                if(i !== 0 && (Is.number(this.raw[i - 1], this.isProgrammingMode) || Is.constant(this.raw[i - 1]) || Is.variable(this.raw[i - 1]))) {
                    this.pushOperator(Operator.MUL);
                }

                const [intA, intB] = this.proResolve(symbol);
                this.intA = intA;
                this.intB = intB;

                this.layer++;

            } else if(Is.mathFunction(symbol)) { // MARK: Function

                // Process something like `2sin(pi/6)`
                if(i !== 0 && !Is.operator(this.raw[i - 1])) {
                    this.pushOperator(Operator.MUL);
                }

                var functionName = symbol.replace("\\", "").replace("(", "");
                if(!functions.has(functionName)) {
                    this.hasError = true;
                    return;
                }

                this.currentFunction = functionName ?? "";
                this.layer++;

            } else if(symbol[0] === "^") { // MARK: Power

                var exponential = parseInt(symbol[1]);
                var poweredToken = this.root.getLastChild<NumberToken | VariableToken>();
                poweredToken instanceof VariableToken
                ? poweredToken.exponential = exponential
                : poweredToken.setValue(MathKits.safePow(this.root.getLastChild().value, exponential));

            } else if(symbol[0] === "!") { // MARK: Factorial

                var factorialToken = this.root.getLastChild();
                if(factorialToken instanceof VariableToken) {
                    factorialToken.factorial = {
                        first: factorialToken.exponential === undefined
                    };

                    continue;
                }

                if(!(factorialToken instanceof NumberToken)) continue;

                var value = MathKits.factorial(factorialToken.value);
                factorialToken.setValue(value);

                // pow
                if(this.hasExponential(i)) {
                    this.root.getLastChild<NumberToken>().setValue(MathKits.safePow(value, parseInt(this.raw[i + 1][1])));
                    i++;
                    continue;
                }

            }
        }

        if(process.env.NODE_ENV === "development") {
            console.log(
                this.raw,
                "\n",
                this.root
            );
        }

        return this.root;
    }

    // MARK: Token Operations

    private pushNumber(numString: string) {
        this.root.add(NumberToken.create(numString, this.numberSys));
    }

    private pushVariable(varSymbol: string) {
        Is.constant(varSymbol)
        ? this.root.add(new NumberToken(constants.get(varSymbol) ?? NaN, NumberSys.DEC))
        : this.root.add(new VariableToken(varSymbol));
    }

    private pushOperator(operator: Operator, isFirst: boolean = false) {
        this.root.add(new OperatorToken(operator, isFirst));
    }

    private pushExponential(i: number): boolean {
        const di = this.raw[i + 1] === "!" ? 2 : 1;
        const hasExp = this.hasExponential(i, di);

        if(hasExp) {
            this.root.getChild<PowerableToken>(this.root.getLength() - di).exponential = parseInt(this.raw[i + di][1]);
        }

        return hasExp;
    }

    private hasExponential(i: number, di: number = 1): boolean {
        return i + di < this.raw.length && this.raw[i + di][0] === "^";
    }

    // MARK: Utilities

    /**
     * To resolve some professional-only symbols
     */
    private proResolve(symbol: string): number[] {
        const resolved = symbol.match(/(|-)\d+/g) ?? ["0", "0"];
        return [parseFloat(resolved[0]), parseFloat(resolved[1])];
    }

    public static purifyNumber(number: NumberSymbol): NumberSymbol {
        // e.g. "\\text{A}" -> "a"
        return number.replaceAll("\\text{", "").replaceAll("}", "").toLowerCase();
    }
}
