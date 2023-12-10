import Evaluator from "@/compiler/Evaluator";
import RootToken from "@/compiler/token/RootToken";
import { delta } from "@/renderer/Render";

export default class Function {
    public id: number;
    public root: RootToken;

    public constructor(id: number, root: RootToken) {
        this.id = id;
        this.root = root;
    }

    public async play(workerCtx: Worker): Promise<void> {
        var rawPitches: number[] = [];

        for(let x = -8; x <= 8; x += delta) {
            var y = new Evaluator(this.root, new Map([["x", x.toString()]])).evaluate();

            rawPitches.push(y);
        }

        const min = Math.min(...rawPitches);
        for(let i = 0; i < rawPitches.length && min < 0; i++) {
            rawPitches[i] += -min;
        }

        workerCtx.postMessage({ type: "play", rawPitches });
    }
}
