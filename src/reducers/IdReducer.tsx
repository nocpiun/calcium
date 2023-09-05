import type { IdReducerStateType, IdReducerActionType } from "@/types";

const IdReducer = (state: IdReducerStateType, action: IdReducerActionType) => {
    switch(action.type) {
        case "refresh":
            return { id: state.id + action.payload };
        default:
            return { id: state.id };
    }
}

export default IdReducer;
