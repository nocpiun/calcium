import React from "react";

import { StateSetter, Mode } from "../types";

interface MainContextType {
    mode: Mode
    setMode: StateSetter<Mode>
}

const MainContext = React.createContext<MainContextType>({
    mode: Mode.GENERAL,
    setMode: (value) => {}
});
MainContext.displayName = "MainContext";

export default MainContext;
