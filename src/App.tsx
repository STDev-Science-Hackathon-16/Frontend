import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Ending from "./pages/Ending";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/ending" element={<Ending />} />
		</Routes>
	);
}

export default App;
