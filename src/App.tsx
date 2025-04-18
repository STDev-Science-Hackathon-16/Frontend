import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Ending from "./pages/Ending";
import Dough from "./pages/Dough";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/dough" element={<Dough />} />
			<Route path="/ending" element={<Ending />} />
		</Routes>
	);
}

export default App;
