import React, {
    ReactElement,
    useEffect,
    useRef,
    useReducer,
    useCallback,
    useContext
} from "react";
import { createPortal } from "react-dom";

import Utils from "./Utils";
import {
    PropsWithChildren,
    KeepAliveReducerStateType,
    KeepAliveReducerActionType
} from "../types";

import KeepAliveContext from "../contexts/KeepAliveContext";

export enum Status {
    CREATING, CREATED
}

function keepAliveReducer(state: KeepAliveReducerStateType, action: KeepAliveReducerActionType): KeepAliveReducerStateType {
    var { type, payload } = action;

    switch(type) {
        case Status.CREATING:
            return {
                ...state,
                [payload.id]: {
                    id: payload.id,
                    element: payload.element,
                    nodes: null
                }
            };
        case Status.CREATED:
            return {
                ...state,
                [payload.id]: {
                    id: payload.id,
                    element: payload.element,
                    nodes: payload.nodes
                }
            };
        default: // impossible
            return state;
    }
}

export const Provider: React.FC<PropsWithChildren> = (props) => {
    const [keepAliveStates, dispatch] = useReducer(keepAliveReducer, {});

    const createKeepAliveState = useCallback((id: string, element: ReactElement) => {
        if(!keepAliveStates[id]) {
            dispatch({
                type: Status.CREATING,
                payload: {
                    id,
                    element,
                    nodes: null
                }
            });
        }
    }, [keepAliveStates]);

    return (
        <KeepAliveContext.Provider value={{ createKeepAliveState, keepAliveStates }}>
            {props.children}
            {
                createPortal(
                    // won't be displayed
                    Object.values(keepAliveStates).map(({ id, element }, index) => {
                        return (
                            <div key={index} ref={(node) => {
                                if(node && !keepAliveStates[id].nodes) {
                                    dispatch({
                                        type: Status.CREATED,
                                        payload: {
                                            id,
                                            element,
                                            nodes: [...node.childNodes]
                                        }
                                    });
                                }
                            }}>{element}</div>
                        );
                    }),
                    Utils.getElem("keep-alive-element-renderer")
                )
            }
        </KeepAliveContext.Provider>
    );
}

export function keepAlive<P extends JSX.IntrinsicAttributes>(component: React.FC<P>, id: string): React.FC<P> {
    return (props) => {
        const { createKeepAliveState, keepAliveStates } = useContext(KeepAliveContext);
        const _ref = useRef<HTMLDivElement>(null);
        const Component = component;

        useEffect(() => {
            var state = keepAliveStates[id];

            if(state && state.nodes) {
                state.nodes.forEach((node) => _ref.current?.appendChild(node));
            } else {
                createKeepAliveState(id, <Component {...props}/>);
            }
        }, [createKeepAliveState, keepAliveStates, props, Component]);

        return (
            <div className="keep-alive-fragment" ref={_ref}>{/* Real Contents */}</div>
        );
    };
}
