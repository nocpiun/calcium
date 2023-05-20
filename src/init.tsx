import Logger from "./utils/Logger";
import { version } from "./global";

// To avoid warning message from katex
console.warn = () => {};

console.error = Logger.error;

Logger.info(
    "\n%cCalcium%cv"+ version +" | By NoahHrreion\n"+
    "%cA web-based calculator.\n\n"+
    "%cWebpage: https://calc.nin.red\n"+
    "%cGithub Repo: https://github.com/nocpiun/calcium\n",
    "font-size: 17pt;font-weight: bold;padding: 10px",
    "font-size: 8pt;color: gray",
    "font-size: 8pt;color: white",
    "font-size: 8pt;color: white",
    "font-size: 8pt;color: white"
);
