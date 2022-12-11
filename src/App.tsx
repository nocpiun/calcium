import React from "react";

// Layout
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
