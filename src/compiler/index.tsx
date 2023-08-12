/* eslint-disable @typescript-eslint/no-redeclare */
import Formula from "./Formula";
import Is from "./Is";
import Compute from "./Compute";

import { functions, constants } from "../global";
import { Operator, NumberSys } from "../types";
import type {
    MathFunction,
    Token,
    ChildrenToken,
    RootToken,
    NumberToken,
    OperatorToken,
    BracketToken,
    FunctionToken,
    PowerableToken
} from "../types";
import Utils from "../utils/Utils";

export type NumberSymbol = string;

export default class Compiler {
    private variables: Map<string, NumberSymbol>;
    private isProgrammingMode: boolean;
    private numberSys: NumberSys;

    private raw: string[];

    private layer: number = 0;
    private inAbs: boolean = false;
    private currentFunction: MathFunction | null = null;
    private secondaryRaw: string[] = [];
    private hasError: boolean = false;
    
    public constructor(
        raw: string[],
        variables: Map<string, string>,
        isProgrammingMode: boolean = false,
        numberSys: NumberSys = NumberSys.DEC
    ) {
        this.raw = raw;
        this.variables = variables;
        this.isProgrammingMode = isProgrammingMode;
        this.numberSys = numberSys;
    }

    public tokenize(): RootToken | void {
        var root: RootToken = {
            type: "root",
            children: []
        };

        var tempNumber: NumberSymbol = "";
        var tempParamRaw: NumberSymbol[] = [];
        var tempParamList: Token[] = [];

        const addNumber = (numberStr: string): NumberToken => {
            var value = Utils.strToNum(numberStr, this.numberSys);
            var token: NumberToken = {
                type: "number",
                value,
                float: Is.float(value),
                numberSys: this.numberSys === NumberSys.HEX ? NumberSys.DEC : this.numberSys
            };
            root.children.push(token);
            
            return token;
        };

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
                        var tokenized = new Compiler(tempParamRaw, this.variables, this.isProgrammingMode, this.numberSys).tokenize();
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
                // Variable and Constant
                if((Is.variable(symbol) || Is.constant(symbol)) && !this.isProgrammingMode) {
                    if(
                        Is.number(this.raw[i - 1], this.isProgrammingMode) ||
                        Is.variable(this.raw[i - 1]) ||
                        Is.constant(this.raw[i - 1])
                    ) { // Process something like `eπ`, `ee` or `2π` which means `e*π`, `e*e` and `2*π`
                        addNumber(
                            tempNumber !== ""
                            ? tempNumber
                            : this.variables.get(this.raw[i - 1]) ?? (constants.get(this.raw[i - 1]) ?? "NaN").toString()
                        );
                        
                        root.children.push({
                            type: "operator",
                            value: Operator.MUL,
                            isFirst: false
                        } as OperatorToken);

                        // Avoid something like `2ab` (a=1,b=2) being processed into `2 * 1 1 * 2`
                        if(
                            !(
                                Is.number(this.raw[i + 1], this.isProgrammingMode) ||
                                Is.variable(this.raw[i + 1]) ||
                                Is.constant(this.raw[i + 1])
                            )
                        ) {
                            symbol = this.variables.get(symbol) ?? (constants.get(symbol) ?? "NaN").toString();
                            addNumber(symbol);
                        }
                        // pow
                        const di = this.raw[i + 1] === "!" ? 2 : 1;
                        if(i + di < this.raw.length && this.raw[i + di][0] === "^") {
                            (root.children[root.children.length - di] as PowerableToken).exponential = parseInt(this.raw[i + di][1]);
                            i++;
                        }
    
                        tempNumber = "";
                        continue;
                    } else if(root.children.length > 0 && root.children[root.children.length - 1].type === "number") { // Process something like `2^2*a`
                        root.children.push({
                            type: "operator",
                            value: Operator.MUL,
                            isFirst: false
                        } as OperatorToken);

                        symbol = this.variables.get(symbol) ?? (constants.get(symbol) ?? "NaN").toString();
                    } else {
                        symbol = this.variables.get(symbol) ?? (constants.get(symbol) ?? "NaN").toString();
                    }
                }

                tempNumber += symbol;

                if(i === this.raw.length - 1) addNumber(tempNumber);
            } else if(Is.operator(symbol)) { // operator
                if(i !== 0 && tempNumber !== "") addNumber(tempNumber);
                root.children.push({
                    type: "operator",
                    value: symbol as Operator,
                    isFirst: i === 0
                } as OperatorToken);

                tempNumber = "";
            } else if(Is.leftBracket(symbol)) { // left bracket
                // Process something like `3(5-2)`
                if(i !== 0 && !Is.operator(this.raw[i - 1])) {
                    if(tempNumber !== "") {
                        addNumber(tempNumber);
                        tempNumber = "";
                    }
                    root.children.push({
                        type: "operator",
                        value: Operator.MUL,
                        isFirst: false
                    } as OperatorToken);
                }
                
                this.layer++;
            } else if(Is.rightBracket(symbol)) { // right bracket
                var secondaryCompiler = new Compiler(this.secondaryRaw, this.variables, this.isProgrammingMode, this.numberSys);
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
                } else if(this.raw[i + 1] === "!") {
                    root.children.push({
                        type: "bracket",
                        children: bracketContent.children,
                        factorial: true
                    } as BracketToken);
                    i++;
                } else {
                    root.children.push({
                        type: "bracket",
                        children: bracketContent.children,
                        factorial: false
                    } as BracketToken);
                }

                this.secondaryRaw = [];

                // pow (after right bracket or factorial sign)
                // (i + di) is where the "^x" sign is
                const di = this.raw[i + 1] === "!" ? 2 : 1;
                if(i + di < this.raw.length && this.raw[i + di][0] === "^") {
                    (root.children[root.children.length - di] as PowerableToken).exponential = parseInt(this.raw[i + di][1]);
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
                    root.children.push({
                        type: "operator",
                        value: Operator.MUL,
                        isFirst: false
                    } as OperatorToken);
                }
            } else if(symbol === "|") { // absolute value
                if(this.inAbs) {
                    var secondaryCompiler = new Compiler(this.secondaryRaw, this.variables, this.isProgrammingMode, this.numberSys);
                    var absContent = secondaryCompiler.tokenize();
                    if(!absContent) {
                        this.hasError = true;
                        return;
                    }

                    root.children.push({
                        type: "abs",
                        children: absContent.children
                    } as ChildrenToken);

                    // pow
                    const di = this.raw[i + 1] === "!" ? 2 : 1;
                    if(i + di < this.raw.length && this.raw[i + di][0] === "^") {
                        (root.children[root.children.length - di] as PowerableToken).exponential = parseInt(this.raw[i + di][1]);
                        i++;
                    }
                    
                    this.secondaryRaw = [];
                    this.inAbs = false;
                } else {
                    this.inAbs = true;
                }
            } else if(Is.mathFunction(symbol)) { // function
                // Process something like `2sin(pi/6)`
                if(i !== 0 && !Is.operator(this.raw[i - 1])) {
                    if(tempNumber !== "") {
                        addNumber(tempNumber);
                        tempNumber = "";
                    }
                    root.children.push({
                        type: "operator",
                        value: Operator.MUL,
                        isFirst: false
                    } as OperatorToken);
                }

                var functionName = symbol.replace("\\", "").replace("(", "");
                if(!functions.has(functionName)) {
                    this.hasError = true;
                    return;
                }

                this.currentFunction = functions.get(functionName) ?? [((x) => x), 1];
                this.layer++;
            } else if(symbol[0] === "^") { // pow
                var exponential = parseInt(symbol[1]);

                addNumber(Compute.safePow(parseFloat(tempNumber), exponential).toString());
                tempNumber = "";
            } else if(symbol[0] === "!") { // factorial
                var value;

                if(root.children.length > 0 && root.children[root.children.length - 1].type === "number") { // multi-factorial
                    value = Compute.factorial((root.children[root.children.length - 1] as NumberToken).value);
                    // rewrite the single-factorial value token, make it to the multi-factorial one
                    (root.children[root.children.length - 1] as NumberToken).value = value;
                } else { // single-factorial
                    value = Compute.factorial(parseFloat(tempNumber));
                    root.children.push({
                        type: "number",
                        value,
                        float: false,
                        numberSys: NumberSys.DEC
                    } as NumberToken);
                    
                    tempNumber = "";
                }

                // pow
                if(i + 1 < this.raw.length && this.raw[i + 1][0] === "^") {
                    (root.children[root.children.length - 1] as NumberToken).value = Compute.safePow(value, parseInt(this.raw[i + 1][1]));
                    i++;
                    continue;
                }
            }
        }

        if(process.env.NODE_ENV === "test") {
            console.log(
                this.raw.join(""),
                "\n",
                root
            );
        }

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
