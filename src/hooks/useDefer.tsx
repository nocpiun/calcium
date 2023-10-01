import { useState } from "react";

export type DeferFunc = (n: number) => boolean;

/**
 * Returns a deferring function that controls
 * the rendering order of components
 * 
 * The function returned is globally unique,
 * which means you can only call `useDefer` once
 * to get the deferring function. And if you're
 * going to use it in somewhere else, you should
 * use context to pass it to that place.
 * 
 * @example
 * ```ts
 * const defer = useDefer();
 * 
 * // ...
 * // (in jsx)
 * {defer(0) && <ExampleComponent />}
 * // Then the ExampleComponent will be rendered at the first frame
 * ```
 */
export default function useDefer(): DeferFunc {
    const [frame, setFrame] = useState(0);

    (function update() {
        window.requestAnimationFrame(() => {
            setFrame((current) => current + 1);
            update();
        });
    })();

    return (n) => n <= frame;
}
