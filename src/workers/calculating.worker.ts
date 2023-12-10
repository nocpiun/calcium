/* eslint-disable no-restricted-globals */
import Compiler from "@/compiler/Compiler";
import Evaluator from "@/compiler/Evaluator";
import RootToken from "@/compiler/token/RootToken";

const ctx: Worker = self as any;

ctx.addEventListener("message", (e) => {
    var req = e.data;

    switch(req.type) {
        case "compile":
            var root = new Compiler(req.rawText.split(" ")).tokenize() ?? new RootToken([]);
            ctx.postMessage({ type: req.type, id: req.id, root });
            break;
        case "evaluate":
            var result = new Evaluator(RootToken.create(req.root), new Map([["x", req.x.toString()]])).evaluate();
            ctx.postMessage({ type: req.type, id: req.id, x: req.x, y: result, operate: req.operate });
            break;
    }
});
