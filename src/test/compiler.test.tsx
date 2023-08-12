import Compiler from "../compiler";

type VariableList = Map<string, string>;

function calculate(formula: string, variables: VariableList = new Map()): string {
    return new Compiler(formula.split(" "), variables).compile();
}

describe("Compiler tests", () => {

    test("Basic Calculations", () => {
        const f1 = "1 9 2 + 1 7 7 - 8 5 - ( 2 2 6 - 1 3 )";
        expect(calculate(f1)).toBe("71");

        const f2 = "- 5 3 - 6 7 - ( 2 2 9 + 8 4 ) + 1 3";
        expect(calculate(f2)).toBe("-420");

        const f3 = "1 8 8 × 3 5 - 2 4 4 / 1 6 - 3 × 8 / 9 × ( 2 3 + 1 ) × 3 × 5 - 1 0 0";
        expect(calculate(f3)).toBe("5504.75");

        const f4 = "2 5 6 4 × 9 2 - 8 8 8 8 / 6 4 + ( 2 5 5 0 - 1 1 3 ) - ( - 3 2 )";
        expect(calculate(f4)).toBe("238218.125");

        const f5 = "6 1 × ( 3 9 - ( 2 8 × 9 1 × ( 5 0 0 - 3 4 2 ) ) + 2 9 × 8 ) - 2";
        expect(calculate(f5)).toBe("-24541095");
    });

    test("Power Calculations", () => {
        const f1 = "3 ^2 + 5";
        expect(calculate(f1)).toBe("14");

        const f2 = "2 × 5 ^3 - 9 ^5 / 9 - ( 4 ^2 - 3 ^2 )";
        expect(calculate(f2)).toBe("-6318");

        const f3 = "( 3 3 + 4 8 ) ^2 - ( 9 9 5 - 8 0 3 ) ^3 + 5 ^4 - 1 0 0 ^2";
        expect(calculate(f3)).toBe("-7080702");

        const f4 = "\\sin( 5 ) ^3";
        expect(calculate(f4)).toBe("-0.88176516603664");

        const f5 = "- | - 2 ^3 | ^2";
        expect(calculate(f5)).toBe("-64");

        const f6 = "( 3 ^2 ) ! ^3";
        expect(calculate(f6)).toBe("47784725839872000");
    });

    test("Function Calculations", () => {
        const f1 = "2 \\sin( \\pi / 6 )";
        expect(calculate(f1)).toBe("1");

        const f2 = "\\tan( \\pi / 4 )";
        expect(calculate(f2)).toBe("1");

        const f3 = "\\tan( 3 \\pi / 2 )";
        expect(calculate(f3)).toBe("NaN");

        const f4 = "\\cos( \\pi / 3 ) 2";
        expect(calculate(f4)).toBe("1");

        const f5 = "\\text{mean}( 1 , 7 , 8 , ( 3 + 9 7 ) , ( 1 1 4 5 1 5 - 1 ) )";
        expect(calculate(f5)).toBe("22926");

        const f6 = "\\text{nPr}( 2 , 1 )";
        expect(calculate(f6)).toBe("2");
    });

    test("Absolute Value Calculations", () => {
        const f1 = "| - 1 9 1 9 8 1 0 |";
        expect(calculate(f1)).toBe("1919810");

        const f2 = "| 5 3 - ( 1 0 0 + 2 2 ) |";
        expect(calculate(f2)).toBe("69");
    });

    test("Factorial Calculations", () => {
        const f1 = "5 !";
        expect(calculate(f1)).toBe("120");

        const f2 = "3 ! !";
        expect(calculate(f2)).toBe("720");

        const f3 = "3 ^2 !";
        expect(calculate(f3)).toBe("362880");

        const f4 = "3 ! ^2";
        expect(calculate(f4)).toBe("36");

        const f5 = "0 . 5 !";
        expect(calculate(f5)).toBe("0.88622692545276");

        const f6 = "( - 1 ) !";
        expect(calculate(f6)).toBe("NaN");

        const f7 = "0 !";
        expect(calculate(f7)).toBe("1");
    });

    test("Calculations with Variables", () => {
        const variables = new Map([
            ["a", "5"],
            ["b", "13"],
            ["c", "134"],
            ["d", "-98"],
            ["x", Math.E.toString()]
        ]);

        const f1 = "√( b ^2 - a ^2 )";
        expect(calculate(f1, variables)).toBe("12");

        const f2 = "\\ln( x ) - d + 3 c - 2 a b + 2 ( a + b )";
        expect(calculate(f2, variables)).toBe("407");

        const f3 = "2 ( a b )";
        expect(calculate(f3, variables)).toBe("130");

        const f4 = "( 2 a ) b";
        expect(calculate(f4, variables)).toBe("130");

        const f5 = "( a b ) 2";
        expect(calculate(f5, variables)).toBe("130");

        const f6 = "2 e \\pi";
        expect(calculate(f6)).toBe("17.07946844534713");

        const f7 = "2 ( e \\pi )";
        expect(calculate(f7)).toBe("17.07946844534714");

        const f8 = "( 2 e ) \\pi";
        expect(calculate(f8)).toBe("17.07946844534713");

        const f9 = "( e \\pi ) 2";
        expect(calculate(f9)).toBe("17.07946844534714");

        const f10 = "2 ^2 e";
        expect(calculate(f10)).toBe("10.87312731383618");
    });

    test("Integrated Calculations", () => {
        const f1 = "1 1 4 + 5 1 4 × ( 1 5 7 + 2 4 6 - 3 / ( 2 9 - 2 8 + 1 3 \\sin( \\pi / 6 ) ^2 - \\text{mean}( 1 , 2 , 3 , ( 2 3 - 1 2 ) + | - 1 5 | ^2 - 3 ! ^2 + 4 ! ) ) ) + \\ln( e )";
        expect(calculate(f1)).toBe("207285.95774647893");
    });

});
