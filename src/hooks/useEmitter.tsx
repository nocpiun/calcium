/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

import Emitter from "@/utils/Emitter";

type EmitterInstance = [string, (...args: any[]) => any];

export default function useEmitter(instances: EmitterInstance[]) {
    useEffect(() => {
        instances.forEach((instance: EmitterInstance, i: number) => {
            Emitter.get().on(instance[0], (...args: any[]) => instance[1](...args));
        });
    }, []);
}
