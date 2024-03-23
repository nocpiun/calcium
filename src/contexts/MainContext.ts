import React from "react";

import { StateSetter, Mode, RenderedFunction } from "@/types";
import { Axis } from "@/renderer/Graphics";

interface MainContextType {
    mode: Mode
    setMode: StateSetter<Mode>
    functionList: RenderedFunction[]
    setFunctionList: StateSetter<RenderedFunction[]>
    axis: Axis
    setAxisType: StateSetter<Axis>
}

const MainContext = React.createContext<MainContextType>(undefined!);
MainContext.displayName = "MainContext";

export default MainContext;
