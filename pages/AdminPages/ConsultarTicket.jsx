import { useTickets } from '../../src/context/ticketContext';
import './ConsultarTicket.css';

export const ConsultarTicket = () => {
  const { tickets } = useTickets();

  // Solo los tickets pendientes
  const ticketsPendientes = tickets.filter(ticket => ticket.estado === 'pendiente');

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
              <tr key={ticket.id}>
                <td>{ticket.idTicket}</td>
                <td>{ticket.nombreCompleto}</td>
                <td>{ticket.id}</td>
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
