import React from "react";

import { StateSetter, Mode, RenderedFunction } from "@/types";

interface MainContextType {
    mode: Mode
    setMode: StateSetter<Mode>
    functionList: RenderedFunction[]
    setFunctionList: StateSetter<RenderedFunction[]>
}

const MainContext = React.createContext<MainContextType>(undefined!);
MainContext.displayName = "MainContext";

export default MainContext;
