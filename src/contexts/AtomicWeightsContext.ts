import React from "react";

import { StateSetter } from "@/types";

interface AtomicWeightsContextType {
    result: number
    setResult: StateSetter<number>
}

const AtomicWeightsContext = React.createContext<AtomicWeightsContextType>(undefined!);
AtomicWeightsContext.displayName = "AtomicWeightsContext";

export default AtomicWeightsContext;
