import RootToken from "@/compiler/token/RootToken";
import Evaluator from "@/compiler/Evaluator";
import { delta } from "@/workers/Render";

export default class Function {
    public root: RootToken;

    public constructor(root: RootToken) {
        this.root = root;
    }

    public calculate(x: number): number {
        return new Evaluator(this.root, new Map([["x", x.toString()]])).evaluate();
    }

    public play(workerCtx: Worker): void {
        var rawPitches: number[] = [];

        for(let x = -8; x <= 8; x += delta) {
            var y = this.calculate(x);

            rawPitches.push(y);
        }

        const min = Math.min(...rawPitches);
        for(let i = 0; i < rawPitches.length && min < 0; i++) {
            rawPitches[i] += -min;
        }

        workerCtx.postMessage({ type: "play", rawPitches });
    }
}
