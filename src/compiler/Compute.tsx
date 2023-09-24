import Is from "@/compiler/Is";
import Utils from "@/utils/Utils";
import Float from "@/compiler/Float";

export default class Compute {
    /** @see https://www.cnblogs.com/jialuchun/p/6559422.html */
    public static factorial(x: number): number {
        if(x < 0) {
            return NaN;
        } else if(x === 0 || x === 1) {
            return 1;
        } else if(!Is.float(x)) {
            for(let i = x - 1; i >= 1; i--) {
                x *= i;
            }
            return x;
        }

        return Compute.gamma(x + 1);
    }

    /** @see https://rosettacode.org/wiki/Gamma_function#JavaScript */
    public static gamma(x: number): number {
        const p = [
            0.99999999999980993, 676.5203681218851, -1259.1392167224028,
            771.32342877765313, -176.61502916214059, 12.507343278686905,
            -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
        ];
    
        const g = 7;
        if(x < 0.5) {
            return Math.PI / (Math.sin(Math.PI * x) * Compute.gamma(1 - x));
        }
    
        x -= 1;
        var a = p[0];
        const t = x + g + 0.5;
        for(var i = 1; i < p.length; i++) {
            a += p[i] / (x + i);
        }
    
        return Math.sqrt(2 * Math.PI) * Math.pow(t, x + 0.5) * Math.exp(-t) * a;
    }

    public static order(nums: number[]): number[] {
        var result: number[] = [];
        for(let i = 0; i < nums.length; i++) {
            if(result.length === 0) {
                result.push(nums[i]);
                continue;
            }

            let j = 0;
            while(j < result.length && nums[i] > result[j]) j++;
            result = Utils.arrayPut(result, j, nums[i]);
        }
        return result;
    }

    public static total(...nums: number[]): number {
        var sum = 0;
        for(let i = 0; i < nums.length; i++) {
            sum += nums[i];
        }
        return sum;
    }

    public static mean(...nums: number[]): number {
        return Compute.total(...nums) / nums.length;
    }

    public static median(...nums: number[]): number {
        var ordered = Compute.order([...nums]);
        return (
            ordered.length % 2 !== 0
            ? ordered[ordered.length / 2 - .5]
            : Compute.mean(ordered[ordered.length / 2], ordered[ordered.length / 2 - 1])
        );
    }

    public static stdev(...nums: number[]): number {
        var average = Compute.mean(...nums);
        var devPowList = [];
        for(let i = 0; i < nums.length; i++) {
            devPowList.push(Compute.safePow(nums[i] - average, 2));
        }

        return Math.sqrt(Compute.total(...devPowList) / (nums.length - 1));
    }

    public static stdevp(...nums: number[]): number {
        var average = Compute.mean(...nums);
        var devPowList = [];
        for(let i = 0; i < nums.length; i++) {
            devPowList.push(Compute.safePow(nums[i] - average, 2));
        }

        return Math.sqrt(Compute.total(...devPowList) / nums.length);
    }

    public static nPr(n: number, r: number): number {
        if(n < r) return 0;
        return Compute.factorial(n) / Compute.factorial(n - r);
    }

    public static nCr(n: number, r: number): number {
        return Compute.factorial(n) / (Compute.factorial(r) * Compute.factorial(n - r));
    }

    public static safeTan(x: number): number {
        var result = Math.tan(x);
        if(result > 136059276645184) return NaN;
        if(result < -286411383293068) return NaN;
        return result;
    }

    public static safePow(x: number, y: number): number {
        if(y === 0) return 1;
        return y > 0 ? Math.pow(x, y) : (1 / Math.pow(x, -y));
    }

    public static maxCommonDivisor(a: number, b: number): number {
        var c;
        while(c !== 0) {
            c = a % b;
            if(c !== 0) {
                a = b;
                b = c;
            }
        }
        return b;
    }

    public static reduction(a: number, b: number): [number, number] {
        const commonDivisor = Compute.maxCommonDivisor(a, b);
        return [Float.divide(a, commonDivisor), Float.divide(b, commonDivisor)];
    }

    public static toFrac(n: number): [number, number] {
        const numStr = n.toString();
        if(numStr.indexOf(".") === -1) return [n, 1];

        const exp = numStr.split(".")[1].length;
        return Compute.reduction(parseInt(numStr.replace(".", "")), 10 ** exp);
    }
}
