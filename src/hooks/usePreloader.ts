/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

type PreloadType = "fetch" | "font" | "image" | "script" | "style" | "track";

export default function usePreloader(target: string | URL, as: PreloadType = "image") {
    useEffect(() => {
        var preloadElem = document.createElement("link");
        preloadElem.rel = "preload";
        typeof target === "string"
        ? preloadElem.href = target
        : preloadElem.href = target.href;
        preloadElem.as = as;
        document.head.appendChild(preloadElem);
    }, []);
}
