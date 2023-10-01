import React from "react";

import { DeferFunc } from "@/hooks/useDefer";
import { StateSetter, Mode, RenderedFunction } from "@/types";

interface MainContextType {
    mode: Mode
    setMode: StateSetter<Mode>
    functionList: RenderedFunction[]
    setFunctionList: StateSetter<RenderedFunction[]>
    defer: DeferFunc
}

const MainContext = React.createContext<MainContextType>(undefined!);
MainContext.displayName = "MainContext";

export default MainContext;
