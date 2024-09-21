import Logger from "@/utils/Logger";
import { version } from "@/global";

// To avoid warning message from katex
console.warn = () => {};

console.error = Logger.error;

Logger.info(
    "\n%cCalcium%cv"+ version +" | Nocpiun Org\n"+
    "%cA web-based calculator.\n\n"+
    "%cWebpage: https://calcium.js.org\n"+
    "%cGithub Repo: https://github.com/nocpiun/calcium\n\n"+
    "%cDonate: https://nin.red/#/donate\n",
    "font-family: Consolas;font-size: 17pt;font-weight: bold;padding: 10px",
    "font-family: Consolas;font-size: 8pt;color: gray",
    "font-family: Consolas;font-size: 8pt;color: white",
    "font-family: Consolas;font-size: 8pt;color: white",
    "font-family: Consolas;font-size: 8pt;color: white",
    "font-family: Consolas;font-size: 8pt;color: white"
);
