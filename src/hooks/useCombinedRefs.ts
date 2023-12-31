import React, { useEffect, useRef } from "react";

/** @see https://itnext.io/reusing-the-ref-from-forwardref-with-react-hooks-4ce9df693dd */
export default function useCombinedRefs<T = any>(...refs: React.MutableRefObject<T | undefined>[]): React.MutableRefObject<T | undefined> {
    const targetRef = useRef<T>();

    useEffect(() => {
        refs.forEach((ref) => {
            if(!ref) return;
    
            ref.current = targetRef.current;
        });
    }, [refs]);

    return targetRef;
}
