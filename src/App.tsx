import React from "react";

// Layout
import "katex/dist/katex.min.css"
import "./style/layout.less";

// Components
import Sidebar from "./components/sidebar";
import Calculator from "./components/Calculator";

const App: React.FC = () => {
	return (
		<main className="calcium">
			<Sidebar/>
			<Calculator/>
		</main>
	);
}

export default App;
