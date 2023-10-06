/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

import Emitter from "@/utils/Emitter";

type EmitterInstance = [string, (...args: any[]) => any];

/**
 * Create an event listener with `EventEmitter`
 * 
 * @example
 * ```ts
 * useEmitter([
 *     ["foo", () => console.log("bar")]
 * ]);
 * 
 * // in somewhere...
 * new Emitter().emit("foo"); // bar
 * ```
 */
export default function useEmitter(instances: EmitterInstance[]): void {
    useEffect(() => {
        instances.forEach((instance: EmitterInstance, i: number) => {
            Emitter.get().on(instance[0], (...args: any[]) => instance[1](...args));
        });
    }, []);
}
