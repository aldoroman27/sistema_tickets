import './App.css'
import { BrowserRouter as Router, Routes, Route,Navigate, useLocation } from "react-router-dom";//Nos permitirá darle una estructura a nuestra web
import { useEffect, useState } from 'react';
import { NavBar } from './components/navbar.jsx';//Importamos nuestro componenete de NavBar que estará presente durante todo el proyecto
import { Login } from '../pages/Login/Login.jsx';//Importamos nuestras demás páginas
import { Tickets } from '../pages/Reportes/Tickets.jsx';//Importamos nuestra página de Tickets
import { CheckTickets } from '../pages/TicketsCheck/Check.jsx';//Importamos la ruta de checkTickets (menú de los admins)
import { BuscarTicket } from '../pages/AdminPages/BuscarTicket.jsx';//Importamos la ruta de buscarTickets
import { LiberarTicket } from '../pages/AdminPages/LiberarTicket.jsx';//Importamos la ruta de liberarTickets (marcar como completados)
import { ConsultarTicket } from '../pages/AdminPages/ConsultarTicket.jsx';//Importamos la ruta de ConsultarTickets
import { EliminarTicket } from '../pages/AdminPages/EliminarTicket.jsx';//Importamos la ruta de eliminarTickets
import { ModificarTicket } from '../pages/AdminPages/ModificarTicket.jsx';//Importamos la ruta de modificarTickets
import { Resueltos } from '../pages/AdminPages/Resueltos.jsx';//Importamos la ruta la ruta de resueltos
import { Home } from '../pages/Home/Home.jsx';//Importamos la ruta de Home (menú de los usuarios que no son admins)
import { GuiaUso } from '../pages/GuiaUso/GuiaUso.jsx';//Importamos la ruta de nuestra Guía de uso.
import { Todos } from '../pages/AdminPages/Todos.jsx';//Importamos la ruta del botón para mostrar todos los reportes (completados y pendientes)
import { ProtectedRoute } from './components/ProtectedRoute.jsx';//Importamos nuestro componente protected rute para gestionar la parte de los usuarios
import { ViewTicket } from '../pages/ViewTicket/ViewTicket.jsx';//Importamos nuestro componente para poder ver los tickets de usuario.
function App() {
  const [usuario, setUsuario] = useState(() => {
     return JSON.parse(localStorage.getItem('usuario'));
  });

  const location = useLocation();

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem('usuario'));
    setUsuario(user);
  }, [location]);

  return (
     <div className="App">
      {/* Solo muestra la NavBar si el usuario está logueado */}
      {usuario && location.pathname !== '/Login' && <NavBar />}

      <Routes>
        {/* Redirige a /Login por defecto */}
        <Route path="/" element={<Navigate to="/Login" />} />
        <Route path="/Login" element={<Login />} />

        {/* Rutas protegidas (solo accesibles si hay sesión) */}
        <Route path="/Tickets" element={<ProtectedRoute><Tickets /></ProtectedRoute>} />{/*User*/}
        <Route path="/CheckTickets" element={<ProtectedRoute onlyAdmin={true}><CheckTickets /></ProtectedRoute>} />{/*Admin*/}
        <Route path="/BuscarTicket" element={<ProtectedRoute ><BuscarTicket /></ProtectedRoute>} />{/*Admin*/}
        <Route path="/LiberarTicket" element={<ProtectedRoute onlyAdmin={true}><LiberarTicket /></ProtectedRoute>} />{/*Admin*/}
        <Route path="/ConsultarTicket" element={<ProtectedRoute onlyAdmin={true}><ConsultarTicket /></ProtectedRoute>} />{/*Admin*/}
        <Route path="/EliminarTicket" element={<ProtectedRoute onlyAdmin={true}><EliminarTicket /></ProtectedRoute>} />{/*Admin*/}
        <Route path="/ModificarTicket" element={<ProtectedRoute onlyAdmin={true}><ModificarTicket /></ProtectedRoute>} />{/*Admin*/}
        <Route path="/Resueltos" element={<ProtectedRoute onlyAdmin={true}><Resueltos /></ProtectedRoute>} />{/*Admin*/}
        <Route path="/Home" element={<ProtectedRoute><Home /></ProtectedRoute>} />{/*User*/}
        <Route path="/GuiaUso" element={<ProtectedRoute><GuiaUso /></ProtectedRoute>} />{/*User*/}
        <Route path="/Todo" element={<ProtectedRoute onlyAdmin={true}><Todos /></ProtectedRoute>} />{/*Admin*/}
        <Route path="/ViewTicket" element={<ProtectedRoute><ViewTicket /></ProtectedRoute>}/>{/*User*/}
      </Routes>
    </div>
  );
}

// Para envolver App con Router, se recomienda exportar así:
export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
