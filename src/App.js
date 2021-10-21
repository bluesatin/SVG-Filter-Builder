// ┌───────────┐
// │  Imports  │
// ╘═══════════╛
import "./css/main.scss"; //Main App CSS
import FilterEditor from "./components/FilterEditor.js";

// ┌────────────┐
// │  Main App  │
// ╘════════════╛
function App() {
  return (
    <div className="app">
      <header className="app--header">
        <h1 className="header--title">SVG-Filter-Builder</h1>
      </header>
      <FilterEditor />
      <footer className="app--footer">
        <p> — Project Github:  — </p>
      </footer>
    </div>
  );
}

export default App;
