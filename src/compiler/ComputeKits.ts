import BigNumber from "bignumber.js";
import MathKits from "@/compiler/MathKits";

/** @see https://www.bbsmax.com/A/qVde1Y9AdP/ */
export default class ComputeKits {
    public static add(a: number, b: number): number {
        if(a > Number.MAX_SAFE_INTEGER || b > Number.MAX_SAFE_INTEGER) {
            return ComputeKits.bigAdd(a.toString(), b.toString());
        }

        var r1: number;
        var r2: number;
        var m: number;

        try {
            r1 = ComputeKits.eTransfer(a).split(".")[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = ComputeKits.eTransfer(b).split(".")[1].length;
        } catch (e) {
            r2 = 0;
        }

        m = MathKits.unsafePow(10, Math.max(r1, r2));
        return (a * m + b * m) / m;
    }

    public static sub(a: number, b: number): number {
        if(a > Number.MAX_SAFE_INTEGER || b > Number.MAX_SAFE_INTEGER) {
            return ComputeKits.bigSub(a.toString(), b.toString());
        }

        var r1: number;
        var r2: number;
        var m: number;
        var n: number;

        try {
            r1 = ComputeKits.eTransfer(a).split('.')[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = ComputeKits.eTransfer(b).split('.')[1].length;
        } catch (e) {
            r2 = 0;
        }

        m = MathKits.unsafePow(10, Math.max(r1, r2));
        n = (r1 >= r2) ? r1 : r2;
        return parseFloat(((a * m - b * m) / m).toFixed(n));
    }

    public static multiply(a: number, b: number): number {
        if(a > Number.MAX_SAFE_INTEGER || b > Number.MAX_SAFE_INTEGER) {
            return ComputeKits.bigMultiply(a.toString(), b.toString());
        }

        var m = 0;
        var s1 = ComputeKits.eTransfer(a);
        var s2 = ComputeKits.eTransfer(b);

        try {
            m += s1.split('.')[1].length;
        } catch (e) {
            //
        }
        try {
            m += s2.split('.')[1].length;
        } catch (e) {
            //
        }

        return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / MathKits.unsafePow(10, m);
    }

    public static divide(a: number, b: number): number {
        if(a > Number.MAX_SAFE_INTEGER || b > Number.MAX_SAFE_INTEGER) {
            return ComputeKits.bigDivide(a.toString(), b.toString());
        }

        var t1 = 0;
        var t2 = 0;
        var r1: number;
        var r2: number;

        if(b === 0) return Infinity;

        try {
            t1 = ComputeKits.eTransfer(a).split('.')[1].length;
        } catch (e) {
            //
        }
        try {
            t2 = ComputeKits.eTransfer(b).split('.')[1].length;
        } catch (e) {
            //
        }

        r1 = Number(ComputeKits.eTransfer(a).replace('.', ''));
        r2 = Number(ComputeKits.eTransfer(b).replace('.', ''));
        var intDiv = r1 / r2;
        var pow = MathKits.unsafePow(10, t2 - t1);
        return ComputeKits.multiply(intDiv, pow);
    }

    /** @see https://www.cnblogs.com/bien94/p/12728886.html */
    public static eTransfer(n: number): string {
        if(isNaN(n)) return n.toString();
        
        n = parseFloat(n +"");
        var eformat = n.toExponential();
        var tmpArray = eformat.match(/\d(?:\.(\d*))?e([+-]\d+)/);
        if(!tmpArray) return NaN.toString();
        var number = n.toFixed(Math.max(0, (tmpArray[1] || '').length - (tmpArray[2] as any)));
        return number;
    }

    public static calibrate(n: number): number {
        // n is in [a,b]
        const a = Math.floor(n);
        const b = a + 1;
        const calibratingNum = 1e-14;

        if(ComputeKits.sub(n, a) <= calibratingNum) return a;
        if(ComputeKits.sub(b, n) <= calibratingNum) return b;

        return n;
    }

    public static bigAdd(a: number | string, b: number | string): number {
        var safeA = new BigNumber(a);
        var safeB = new BigNumber(b);
        
        return safeA.plus(safeB).toNumber();
    }

    public static bigSub(a: number | string, b: number | string): number {
        var safeA = new BigNumber(a);
        var safeB = new BigNumber(b);
        
        return safeA.minus(safeB).toNumber();
    }

    public static bigMultiply(a: number | string, b: number | string): number {
        var safeA = new BigNumber(a);
        var safeB = new BigNumber(b);
        
        return safeA.times(safeB).toNumber();
    }

    public static bigDivide(a: number | string, b: number | string): number {
        var safeA = new BigNumber(a);
        var safeB = new BigNumber(b);
        
        return safeA.dividedBy(safeB).toNumber();
    }
}
