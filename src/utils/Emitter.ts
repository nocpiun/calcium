import { EventEmitter } from "events";

export default class Emitter extends EventEmitter {
    private static instance: Emitter | null;

    public static get(): Emitter {
        if(!Emitter.instance) {
            Emitter.instance = new Emitter();
            Emitter.instance.setMaxListeners(Infinity);
        }
        return Emitter.instance;
    }
}
