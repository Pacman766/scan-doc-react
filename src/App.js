import ScanPanel from "./components/ScanPanel";
import "./App.css"
import {ScanProvider} from "./context/ScanContext";

function App() {
  return (
    <div className="App">
        <ScanProvider>
            <ScanPanel/>
        </ScanProvider>
    </div>
  );
}

export default App;
