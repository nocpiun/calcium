import React from "react";

// Layout
import "katex/dist/katex.min.css"
import "./style/layout.less";

// Components
import Sidebar from "./components/sidebar";
import Calculator from "./components/Calculator";

const App: React.FC = () => {
	return (
		<>
			<main className="calcium">
				<Sidebar/>
				<Calculator/>
			</main>
			<p className="no-mobile">Please open the app in your computer!</p>
		</>
	);
}

export default App;
