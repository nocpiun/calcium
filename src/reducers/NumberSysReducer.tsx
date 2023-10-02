import Transformer from "@/compiler/Transformer";
import type { ReducerAction } from "@/types";

interface NumberSysReducerStateType {
    hex: string
    dec: string
    oct: string
    bin: string
}

interface NumberSysReducerActionType extends ReducerAction<"set", string> {
    
}

const NumberSysReducer = (state: NumberSysReducerStateType, action: NumberSysReducerActionType) => {
    switch(action.type) {
        case "set":
            if(action.payload === "0") return {
                hex: "0",
                dec: "0",
                oct: "0",
                bin: "0"
            }

            return {
                hex: Transformer.decToHex(action.payload),
                dec: action.payload,
                oct: Transformer.decToOct(action.payload),
                bin: Transformer.decToBin(action.payload)
            };
        default:
            return state;
    }
}

export default NumberSysReducer;
