import React from "react";

interface SelectContextType {
    selectorId: string
    selectorValue: string
}

const SelectContext = React.createContext<SelectContextType>(undefined!);
SelectContext.displayName = "SelectContext";

export default SelectContext;
