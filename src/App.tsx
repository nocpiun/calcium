import React from "react";
import "https://cdn.jsdelivr.net/npm/hidpi-canvas@1.0.10/dist/hidpi-canvas.min.js";

// Layout
import "katex/dist/katex.min.css"
import "./style/layout.less";

// Components
import Sidebar from "./components/sidebar";
import Calculator from "./components/calculator";

const App: React.FC = () => {
	return (
		<main className="calcium">
			<Sidebar/>
			<Calculator/>
		</main>
	);
}

export default App;
