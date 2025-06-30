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
import { Home } from '../pages/Home/Home.jsx';
import { GuiaUso } from '../pages/GuiaUso/GuiaUso.jsx';
import { Todos } from '../pages/AdminPages/Todos.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { AdminRoute } from './components/AdminRoute.jsx';

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar/>
        <Routes>
          <Route path='/Login' element={<Login/>} />
          {/* Rutas protegidas por login */}
          <Route path="/Home" element={
            <ProtectedRoute><Home /></ProtectedRoute>
          } />
          <Route path="/Tickets" element={
            <ProtectedRoute><Tickets /></ProtectedRoute>
          } />
          <Route path="/GuiaUso" element={
            <ProtectedRoute><GuiaUso /></ProtectedRoute>
          } />

          {/* Rutas solo para admin */}
          <Route path="/CheckTickets" element={
            <AdminRoute><CheckTickets /></AdminRoute>
          } />
          <Route path="/BuscarTicket" element={
            <AdminRoute><BuscarTicket /></AdminRoute>
          } />
          <Route path="/LiberarTicket" element={
            <AdminRoute><LiberarTicket /></AdminRoute>
          } />
          <Route path="/ConsultarTicket" element={
            <AdminRoute><ConsultarTicket /></AdminRoute>
          } />
          <Route path="/EliminarTicket" element={
            <AdminRoute><EliminarTicket /></AdminRoute>
          } />
          <Route path="/ModificarTicket" element={
            <AdminRoute><ModificarTicket /></AdminRoute>
          } />
          <Route path="/Resueltos" element={
            <AdminRoute><Resueltos /></AdminRoute>
          } />
          <Route path="/Todo" element={
            <AdminRoute><Todos /></AdminRoute>
          } />
        </Routes>
      </Router>
    </div>
  );
}

export default App;