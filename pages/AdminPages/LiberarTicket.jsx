import './LiberarTicket.css';
import { useState } from 'react';
import { useTickets } from '../../src/context/ticketContext';


export const LiberarTicket = () => {

  const { tickets, liberarTicket } = useTickets();
  const [idBuscar, setIdBuscar] = useState('');
  const [ticketEncontrado, setTicketEncontrado] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const handleBuscar = () => {
    const resultado = tickets.find(t => String(t.idTicket) && t.status === 'Pendiente');
    if (resultado) {
      setTicketEncontrado(resultado);
      setMensaje('');
    } else {
      setTicketEncontrado(null);
      setMensaje('❌ Ticket no encontrado o ya está completado.');
    }
  };

  const handleLiberar = () => {
    liberarTicket(ticketEncontrado.idTicket);
    setMensaje('✅ Ticket liberado correctamente.');
    setTicketEncontrado(null);
    setIdBuscar('');
  };

  return (
    <div className="liberar-container">
      <h2>Liberar Ticket</h2>

      <div className="buscador">
        <input
          type="text"
          placeholder="Ingresa ID del ticket"
          value={idBuscar}
          onChange={(e) => setIdBuscar(e.target.value)}
        />
        <button onClick={handleBuscar}>Buscar</button>
      </div>
      {mensaje && <p className="mensaje">{mensaje}</p>}
      {ticketEncontrado && (
        <div className="ticket-info">
          <p><strong>Id Ticket:</strong>{ticketEncontrado.idTicket}</p>
          <p><strong>Empleado:</strong> {ticketEncontrado.nombreCompleto}</p>
          <p><strong>Equipo:</strong> {ticketEncontrado.equipo}</p>
          <p><strong>Descripción:</strong> {ticketEncontrado.descripcion}</p>
          <p><strong>Estado:</strong> {ticketEncontrado.status}</p>

          <button className="btn-liberar" onClick={handleLiberar}>Marcar como Completado</button>
        </div>
      )}
    </div>
  );
}

export default LiberarTicket