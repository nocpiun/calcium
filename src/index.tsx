import ReactDOM from "react-dom/client";
import App from "./App";

import { version } from "./global";

console.log(
  "%cCalcium%cv"+ version +" | By NoahHrreion\n"+
  "%cA web-based calculator.\n\n"+
  "%cWebpage: https://calc.nin.red\n"+
  "%cGithub Repo: https://github.com/nocpiun/calcium\n",
  "font-size: 17pt;font-weight: bold;padding: 10px",
  "font-size: 8pt;color: gray",
  "font-size: 8pt;color: white",
  "font-size: 8pt;color: white",
  "font-size: 8pt;color: white"
);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
