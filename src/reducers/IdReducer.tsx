import type { ReducerAction } from "@/types";

interface IdReducerStateType {
    id: number
}

interface IdReducerActionType extends ReducerAction<"refresh", number> {
    
}

const IdReducer = (state: IdReducerStateType, action: IdReducerActionType) => {
    switch(action.type) {
        case "refresh":
            return { id: state.id + action.payload };
        default:
            return { id: state.id };
    }
}

export default IdReducer;
