import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";//Nos permitirá darle una estructura a nuestra web
import { NavBar } from './components/navbar.jsx';//Importamos nuestro componenete de NavBar que estará presente durante todo el proyecto
import { Login } from '../pages/Login/Login.jsx';//Importamos nuestras demás páginas
import { Tickets } from '../pages/Reportes/Tickets.jsx';
import { CheckTickets } from '../pages/TicketsCheck/Check.jsx';
import { BuscarTicket } from '../pages/AdminPages/BuscarTicket.jsx';
import { LiberarTicket } from '../pages/AdminPages/LiberarTicket.jsx';
import { ConsultarTicket } from '../pages/AdminPages/ConsultarTicket.jsx';
import { EliminarTicket } from '../pages/AdminPages/EliminarTicket.jsx';
import { ModificarTicket } from '../pages/AdminPages/ModificarTicket.jsx';
import { Resueltos } from '../pages/AdminPages/Resueltos.jsx';

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar/>
        <Routes>
          <Route path='/Login' element={<Login/>} />
          <Route path='/Tickets' element={<Tickets/>}/>
          <Route path='/CheckTickets' element={<CheckTickets/>}/>
          <Route path='/BuscarTicket' element={<BuscarTicket/>}/>
          <Route path='/LiberarTicket' element={<LiberarTicket/>}/>
          <Route path='/ConsultarTicket' element={<ConsultarTicket/>}/>
          <Route path='/EliminarTicket' element={<EliminarTicket/>}/>
          <Route path='/ModificarTicket' element={<ModificarTicket/>}/>
          <Route path='/Resueltos' element={<Resueltos/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;