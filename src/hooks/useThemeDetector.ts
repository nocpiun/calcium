import { Theme } from "@/types";

export default function useThemeDetector(): Theme {
    return window.matchMedia("(prefers-color-scheme: light)").matches ? Theme.LIGHT : Theme.DARK;
}
