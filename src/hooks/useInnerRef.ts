import React, { useRef } from "react";

import useCombinedRefs from "@/hooks/useCombinedRefs";

export default function useInnerRef<T>(forwardedRef: React.ForwardedRef<T>): React.MutableRefObject<T | undefined> {
    const innerRef = useRef<T>();
    return useCombinedRefs(innerRef, forwardedRef as React.MutableRefObject<T>);
}
