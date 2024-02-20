import { EventEmitter } from "events";

import Singleton from "@/utils/Singleton";

@Singleton
export default class Emitter extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(Infinity);
    }
}
