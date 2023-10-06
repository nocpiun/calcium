/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";

/**
 * Apply the *easter* to a React component
 */
export default function useEaster(contentSetter: React.Dispatch<React.SetStateAction<string>>): void {
    useEffect(() => {
        document.body.addEventListener("keydown", (e: KeyboardEvent) => {
            if(e.ctrlKey && e.key === "m") { // ctrl + m
                contentSetter("c^{xk}+c^{trl}"); // I'm iKun
                return;
            }
        });
    }, []);
}
