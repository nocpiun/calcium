import React from "react";

import { StateSetter, Mode, RenderedFunction } from "../types";

interface MainContextType {
    mode: Mode
    setMode: StateSetter<Mode>
    functionList: RenderedFunction[],
    setFunctionList: StateSetter<RenderedFunction[]>
}

const MainContext = React.createContext<MainContextType>({
    mode: Mode.GENERAL,
    setMode: (value) => {},
    functionList: [],
    setFunctionList: (value) => {}
});
MainContext.displayName = "MainContext";

export default MainContext;
