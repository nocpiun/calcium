import React, { useState, useEffect } from "react";
import { AliveScope } from "react-activation";

import { shortcuts } from "@/global";
import { Mode, RenderedFunction } from "@/types";
import Utils from "@/utils/Utils";
import Storage from "@/utils/Storage";
import { Axis } from "@/renderer/Graphics";

import usePreloader from "@/hooks/usePreloader";

// Layout
import "katex/dist/katex.min.css";
import "use-context-menu/styles.css";
import "react-tooltip/dist/react-tooltip.css";
import "@nocp/toggle/dist/toggle.css";
import "flag-icons/css/flag-icons.min.css";
import "@/style/layout.less";

// Components
import Calculator from "@/views/Calculator";
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import StatusBar from "@/components/statusbar";

// Contexts
import MainContext from "@/contexts/MainContext";

const App: React.FC = () => {
	const [mode, setMode] = useState<Mode>(new Storage().getItem("ca-mode", Mode.GENERAL) as Mode);
	const [functionList, setFunctionList] = useState<RenderedFunction[]>([]);
	const [axis, setAxisType] = useState<Axis>(Axis.CARTESIAN);

	usePreloader(new URL("@/workers/graphing.worker.ts", import.meta.url), "script");
	usePreloader(new URL("@/workers/calculating.worker.ts", import.meta.url), "script");

	useEffect(() => {
		document.body.addEventListener("keydown", (e: KeyboardEvent) => {
			shortcuts.forEach((shortcut, key) => {
				if(
					key.includes(e.key) &&
					(
						(e.ctrlKey && key.includes("ctrl")) ||
						(e.shiftKey && key.includes("shift")) ||
						(e.altKey && key.includes("alt")) ||
						(key.length === 1)
					)
				) {
					e.preventDefault();
					shortcut.action();
				}
			});
		});

		document.body.addEventListener("contextmenu", (e: MouseEvent) => {
			e.preventDefault();
		});

		window.addEventListener("beforeunload", (e) => {
			e.preventDefault();
			alert("确定要关闭此页面吗？");
			e.returnValue = "";
		});

		// To prevent some part of the page being covered by the bottom toolbar of mobile browsers
		if(Utils.isMobile()) {
			const { height } = Utils.getWindowConfig();
			document.body.style.height = height +"px";
			Utils.getElem("calcium-main").style.height = height +"px";
		}
	}, []);

	return (
		<main className="calcium" id="calcium-main">
			<MainContext.Provider value={{ mode, setMode, functionList, setFunctionList, axis, setAxisType }}>
				<AliveScope>
					{!Utils.isMobile() && <Navbar />}
					<div className="app">
						<Sidebar />
						<Calculator />
					</div>
					<StatusBar />
				</AliveScope>
			</MainContext.Provider>
		</main>
	);
}

export default App;
