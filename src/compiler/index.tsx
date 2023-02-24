/* eslint-disable @typescript-eslint/no-redeclare */
import Formula from "./Formula";
import Is from "./Is";

import { functions, constants } from "../global";
import { Operator, NumberSys } from "../types";
import type {
    MathFunction,
    Token,
    ValueToken,
    ChildrenToken,
    RootToken,
    NumberToken,
    BracketToken,
    FunctionToken
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

        const addNumber = (numberStr: string) => {
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
                    ) { // Process the formula like `eπ`, `ee` or `2π` which means `e*π`, `e*e` and `2*π`
                        addNumber(
                            tempNumber !== ""
                            ? tempNumber
                            : this.variables.get(this.raw[i - 1]) ?? (constants.get(symbol) ?? "NaN").toString()
                        );
                        
                        root.children.push({
                            type: "operator",
                            value: Operator.MUL
                        } as ValueToken<Operator>);

                        symbol = this.variables.get(symbol) ?? (constants.get(symbol) ?? "NaN").toString();
                        addNumber(symbol);
    
                        tempNumber = "";
                        continue;
                    } else {
                        symbol = this.variables.get(symbol) ?? (constants.get(symbol) ?? "NaN").toString();
                    }
                }

                tempNumber += symbol;

                if(i === this.raw.length - 1) addNumber(tempNumber);
            } else if(Is.operator(symbol)) { // operator
                // if(symbol === "-" && i === 0) {
                //     tempNumber += "-";
                //     continue;
                // }
                if(i !== 0 && tempNumber !== "") addNumber(tempNumber);
                root.children.push({
                    type: "operator",
                    value: symbol as Operator
                } as ValueToken<Operator>);

                tempNumber = "";
            } else if(Is.leftBracket(symbol)) { // left bracket
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
                var targetNumberToken = addNumber(tempNumber);

                for(let j = 0; j < parseInt(symbol[1]) - 1; j++) {
                    root.children.push({
                        type: "operator",
                        value: Operator.MUL
                    } as ValueToken<Operator>);
                    root.children.push(targetNumberToken);
                }

                tempNumber = "";
            } else if(symbol[0] === "!") { // factorial
                var value = Utils.factorial(parseInt(tempNumber));
                root.children.push({
                    type: "number",
                    value,
                    float: false,
                    numberSys: NumberSys.DEC
                } as NumberToken);
                
                tempNumber = "";
            }
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
