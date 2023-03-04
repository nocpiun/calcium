import React, { useEffect } from "react";

import { shortcuts } from "./global";

// Layout
import "katex/dist/katex.min.css"
import "./style/layout.less";

// Components
import Sidebar from "./components/sidebar";
import Calculator from "./components/Calculator";
import StatusBar from "./components/statusbar";

const App: React.FC = () => {
	useEffect(() => {
		document.body.addEventListener("keydown", (e: KeyboardEvent) => {
			shortcuts.forEach((shortcut, key) => {
				if(e.ctrlKey && key.includes("ctrl") && key.includes(e.key)) {
					e.preventDefault();
					shortcut.action();
					return;
				}
				if(e.shiftKey && key.includes("shift") && key.includes(e.key)) {
					e.preventDefault();
					shortcut.action();
					return;
				}
			});
		});
	}, []);

	return (
		<>
			<main className="calcium">
				<div className="app">
					<Sidebar/>
					<Calculator/>
				</div>
				<StatusBar />
			</main>
			<p className="no-mobile">Please open the app in your computer!</p>
		</>
	);
}

export default App;
