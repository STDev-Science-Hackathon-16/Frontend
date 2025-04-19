import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dough from "./pages/Dough";
import PrimaryFermentation from "./pages/PrimaryFermentation";
import Shaping from "./pages/Shaping";
import SecondaryFermentation from "./pages/SecondaryFermentation";
import Baking from "./pages/Baking";
import Chatbot from "./components/Chatbot";
import Ending from "./pages/Ending";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/dough" element={<Dough />} />
			<Route path="/primary" element={<PrimaryFermentation />} />
			<Route path="/shaping" element={<Shaping />} />
			<Route path="/secondary" element={<SecondaryFermentation />} />
			<Route path="/baking" element={<Baking />} />
			<Route path="/fail" element={<Chatbot />} />
			<Route path="/ending" element={<Ending />} />
		</Routes>
	);
}

export default App;
