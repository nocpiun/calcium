export default class Compute {
    /** @see https://www.cnblogs.com/jialuchun/p/6559422.html */
    public static factorial(x: number): number {
        if(x < 0) {
            return NaN;
        } else if(x === 0 || x === 1) {
            return 1;
        } else if(Math.floor(x) === x) {
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

    public static mean(...nums: number[]): number {
        var sum = 0;
        for(let i = 0; i < nums.length; i++) {
            sum += nums[i];
        }
        return sum / nums.length;
    }

    public static stdev(...nums: number[]): number {
        var average = Compute.mean(...nums);
        var devPowList = [];
        for(let i = 0; i < nums.length; i++) {
            devPowList.push(Compute.safePow(nums[i] - average, 2));
        }
        
        var devPowSum = 0;
        for(let i = 0; i < devPowList.length; i++) {
            devPowSum += devPowList[i];
        }

        return Math.sqrt(devPowSum / (nums.length - 1));
    }

    public static stdevp(...nums: number[]): number {
        var average = Compute.mean(...nums);
        var devPowList = [];
        for(let i = 0; i < nums.length; i++) {
            devPowList.push(Compute.safePow(nums[i] - average, 2));
        }
        
        var devPowSum = 0;
        for(let i = 0; i < devPowList.length; i++) {
            devPowSum += devPowList[i];
        }

        return Math.sqrt(devPowSum / nums.length);
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
}
