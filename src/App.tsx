import { Button } from "./components/ui/button";

function App() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<Button variant="default">기본 버튼</Button>
			<Button variant="outline" className="ml-4">
				아웃라인 버튼
			</Button>
		</div>
	);
}

export default App;
