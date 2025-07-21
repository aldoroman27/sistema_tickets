import axios from 'axios';
import { useState, useEffect } from 'react';
import './ViewTicket.css'; // si tienes estilos

export const ViewTicket = () => {
  const [idUsuario, setIdUsuario] = useState('');
  const [tickets, setTickets] = useState([]);
  const [cargando, setCargando] = useState(true);
  const send_mistickets = import.meta.env.VITE_mistickets_send;
  //Vamos a cargar al usuario para poder trabajar con su información
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
  console.log('LocalStorage:', usuarioGuardado);

  if (usuarioGuardado) {
    try {
      const usuario = JSON.parse(usuarioGuardado);
      const id = usuario.id || usuario.idEmpleado;
      setIdUsuario(id);
      console.log('ID extraído:', id);

      if (id) {
        console.log('Haciendo petición a:', `${send_mistickets}/${id}`);
        axios.get(`${send_mistickets}/${id}`)
          .then((response) => {
            console.log('Tickets recibidos:', response.data);
            setTickets(response.data);
            setCargando(false);
          })
          .catch((error) => {
            console.error('Error al obtener los tickets:', error);
            setCargando(false);
          });
      } else {
        console.warn('ID del usuario es undefined/null');
        setCargando(false);
      }

    } catch (e) {
      console.error('Usuario inválido en localStorage:', e);
      setCargando(false);
    }
  } else {
    console.warn('No hay usuario guardado');
    setCargando(false);
  }
  }, []);

  return (
    <div className="view-ticket-container">
      <h2> Tus Tickets Registrados</h2>

      {cargando ? (
        <p>Cargando tickets...</p>
      ) : tickets.length === 0 ? (
        <p>No tienes tickets registrados.</p>
      ) : (
        <table className="tabla-tickets">
          <thead>
            <tr>
              <th>ID Ticket</th>
              <th>Nombre-Solicitante</th>
              <th>Departamento</th>
              <th>Equipo</th>
              <th>Descripción</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket.mongoID}>
                <td>{ticket.idTicket}</td>
                <td>{ticket.nombreCompleto}</td>
                <td>{ticket.departamento}</td>
                <td>{ticket.equipo}</td>
                <td>{ticket.descripcion}</td>
                <td>{ticket.fecha}</td>
                <td>{ticket.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewTicket;
