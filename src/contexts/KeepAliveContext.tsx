import React, { ReactElement } from "react";

import type { KeepAliveReducerStateType } from "../types";

interface KeepAliveContextType {
    createKeepAliveState: (id: string, element: ReactElement) => void
    keepAliveStates: KeepAliveReducerStateType
}

const KeepAliveContext = React.createContext<KeepAliveContextType>(undefined!);
KeepAliveContext.displayName = "KeepAliveContext";

export default KeepAliveContext;
