import React, { ReactElement } from "react";

import type { KeepAliveReducerStateType } from "../types";

interface KeepAliveContextType {
    setKeepAliveState: (id: string, element: ReactElement) => void
    keepAliveStates: KeepAliveReducerStateType
}

const KeepAliveContext = React.createContext<KeepAliveContextType>(undefined!);
KeepAliveContext.displayName = "KeepAliveContext";

export default KeepAliveContext;
