import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NavBar } from './components/navbar.jsx';

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar/>
        <Routes>
        </Routes>
      </Router>
    </div>
  );
}

export default App;