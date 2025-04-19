import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dough from "./pages/Dough";
import PrimaryFermentation from "./pages/PrimaryFermentation";
import Fail from "./pages/Fail";
import Ending from "./pages/Ending";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/dough" element={<Dough />} />
			<Route path="/primary" element={<PrimaryFermentation />} />
			<Route path="/fail" element={<Fail />} />
			<Route path="/ending" element={<Ending />} />
		</Routes>
	);
}

export default App;
