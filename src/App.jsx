import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NavBar } from './components/navbar.jsx';
import { Login } from '../pages/Login/Login.jsx';
import { Tickets } from '../pages/Reportes/Tickets.jsx';
import { CheckTickets } from '../pages/TicketsCheck/Check.jsx';


function App() {
  return (
    <div className="App">
      <Router>
        <NavBar/>
        <Routes>
          <Route path='/Login' element={<Login/>} />
          <Route path='/Tickets' element={<Tickets/>}/>
          <Route path='/CheckTickets' element={<CheckTickets/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;