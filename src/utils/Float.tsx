/** @see https://www.bbsmax.com/A/qVde1Y9AdP/ */
export default class Float {
    public static add(a: number, b: number): number {
        var r1: number;
        var r2: number;
        var m: number;

        try {
            r1 = a.toString().split(".")[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = b.toString().split(".")[1].length;
        } catch (e) {
            r2 = 0;
        }

        m = Math.pow(10, Math.max(r1, r2));
        return (a * m + b * m) / m;
    }

    public static sub(a: number, b: number): number {
        var r1: number;
        var r2: number;
        var m: number;
        var n: number;

        try {
            r1 = a.toString().split('.')[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = b.toString().split('.')[1].length;
        } catch (e) {
            r2 = 0;
        }

        m = Math.pow(10, Math.max(r1, r2));
        n = (r1 >= r2) ? r1 : r2;
        return parseFloat(((a * m - b * m) / m).toFixed(n));
    }

    public static multiply(a: number, b: number): number {
        var m = 0;
        var s1 = a.toString();
        var s2 = b.toString();

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

        return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
    }

    public static divide(a: number, b: number): number {
        var t1 = 0;
        var t2 = 0;
        var r1: number;
        var r2: number;

        try {
            t1 = a.toString().split('.')[1].length;
        } catch (e) {
            //
        }
        try {
            t2 = b.toString().split('.')[1].length;
        } catch (e) {
            //
        }

        r1 = Number(a.toString().replace('.', ''));
        r2 = Number(b.toString().replace('.', ''));
        var intDiv = r1 / r2;
        var pow = Math.pow(10, t2 - t1);
        return Float.multiply(intDiv, pow);
    }
}
