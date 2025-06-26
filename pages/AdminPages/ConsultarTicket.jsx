import { useTickets } from '../../src/context/ticketContext';
import { useEffect, useState } from 'react';
import './ConsultarTicket.css';
import axios from 'axios';

export const ConsultarTicket = () => {
  const [tickets, setTickets] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const obtenerTickets = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tickets');
        setTickets(response.data);
        setCargando(false);
      } catch (error) {
        console.error('Error al obtener tickets:', error);
        setError('Hubo un problema al obtener los tickets');
        setCargando(false);
      }
    };

    obtenerTickets();
  }, []);

  // Filtramos los que estén pendientes
  const ticketsPendientes = tickets.filter(ticket => ticket.estado === 'pendiente');

  if (cargando) return <p>Cargando tickets...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="consultar-container">
      <h2>Tickets Pendientes</h2>

      {ticketsPendientes.length === 0 ? (
        <p>No hay tickets pendientes actualmente.</p>
      ) : (
        <table className="tabla-tickets">
          <thead>
            <tr>
              <th>ID Ticket</th>
              <th>Empleado</th>
              <th>ID Empleado</th>
              <th>Departamento</th>
              <th>Equipo</th>
              <th>Descripción</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {ticketsPendientes.map(ticket => (
              <tr key={ticket.idTicket}>
                <td>{ticket.idTicket}</td>
                <td>{ticket.nombreCompleto}</td>
                <td>{ticket.idEmpleado}</td>
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

export default ConsultarTicket;
