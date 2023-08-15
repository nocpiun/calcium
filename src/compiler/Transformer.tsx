import type { NumberSymbol } from "./Compiler";

export default class Transformer {
    public static hexToDec(hex: NumberSymbol): NumberSymbol {
        return parseInt(hex, 16).toString(10);
    }
    
    public static hexToOct(hex: NumberSymbol): NumberSymbol {
        return parseInt(hex, 16).toString(8);
    }
    
    public static hexToBin(hex: NumberSymbol): NumberSymbol {
        return parseInt(hex, 16).toString(2);
    }
    
    public static decToHex(dec: NumberSymbol): NumberSymbol {
        return parseInt(dec).toString(16).toUpperCase();
    }
    
    public static decToOct(dec: NumberSymbol): NumberSymbol {
        return parseInt(dec).toString(8);
    }
    
    public static decToBin(dec: NumberSymbol): NumberSymbol {
        return parseInt(dec).toString(2);
    }
    
    public static octToHex(oct: NumberSymbol): NumberSymbol {
        return parseInt(oct, 8).toString(16).toUpperCase();
    }
    
    public static octToDec(oct: NumberSymbol): NumberSymbol {
        return parseInt(oct, 8).toString(10);
    }
    
    public static octToBin(oct: NumberSymbol): NumberSymbol {
        return parseInt(oct, 8).toString(2);
    }
    
    public static binToHex(bin: NumberSymbol): NumberSymbol {
        return parseInt(bin, 2).toString(16).toUpperCase();
    }
    
    public static binToDec(bin: NumberSymbol): NumberSymbol {
        return parseInt(bin, 2).toString(10);
    }
    
    public static binToOct(bin: NumberSymbol): NumberSymbol {
        return parseInt(bin, 2).toString(8);
    }
}
