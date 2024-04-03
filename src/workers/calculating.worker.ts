/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable no-restricted-globals */
import Compiler from "@/compiler/Compiler";
import Evaluator from "@/compiler/Evaluator";
import RootToken from "@/compiler/token/RootToken";
import { FunctionInputtingType } from "@/types";

const ctx: Worker = self as any;

ctx.addEventListener("message", (e) => {
    var req = e.data;

    switch(req.type) {
        case "compile":
            var root = new Compiler(req.rawText.split(" ")).tokenize() ?? new RootToken([]);
            ctx.postMessage({ type: req.type, id: req.id, mode: req.mode, root });
            break;
        case "compile-and-set":
            var root = new Compiler(req.rawText.split(" ")).tokenize() ?? new RootToken([]);
            ctx.postMessage({ type: req.type, index: req.index, mode: req.mode, root });
            break;
        case "evaluate":
            var result = req.mode === FunctionInputtingType.NORMAL
            ? new Evaluator(RootToken.create(req.root), new Map([["x", req.x.toString()]])).evaluate()
            : new Evaluator(RootToken.create(req.root), new Map([["\\theta", req.x.toString()]])).evaluate();
            ctx.postMessage({ type: req.type, id: req.id, mode: req.mode, x: req.x, y: result, operate: req.operate });
            break;
    }
});
