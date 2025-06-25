import './EliminarTicket.css';
import { useState } from 'react';
import { useTickets } from '../../src/context/ticketContext';

export const EliminarTicket = () => {
  const { tickets, eliminarTicket } = useTickets();
  const [idBuscar, setIdBuscar] = useState('');
  const [ticketEncontrado, setTicketEncontrado] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const handleBuscar = () => {
    if (!idBuscar.trim()) {
      setMensaje('⚠️ Ingresa un ID para buscar.');
      return;
    }

    if (!/^\d+$/.test(idBuscar)) {
      setMensaje('⚠️ El ID debe ser un número.');
      return;
    }

    if (tickets.length === 0) {
      setMensaje('⚠️ No hay tickets registrados.');
      return;
    }

    const resultado = tickets.find(
      t => String(t.idTicket) === idBuscar && t.estado === 'pendiente'
    );

    if (resultado) {
      setTicketEncontrado(resultado);
      setMensaje('');
    } else {
      setTicketEncontrado(null);
      setMensaje('❌ Ticket no encontrado o ya fue eliminado/liberado.');
    }
  };

  const handleEliminar = () => {
    eliminarTicket(ticketEncontrado.idTicket);
    setMensaje('✅ Ticket eliminado correctamente.');
    setTicketEncontrado(null);
    setIdBuscar('');
  };

  return (
    <div className="eliminar-container">
      <h2>Eliminar Ticket</h2>

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
          <p><strong>Id Ticket:</strong> {ticketEncontrado.idTicket}</p>
          <p><strong>Empleado:</strong> {ticketEncontrado.nombreCompleto}</p>
          <p><strong>Equipo:</strong> {ticketEncontrado.equipo}</p>
          <p><strong>Descripción:</strong> {ticketEncontrado.descripcion}</p>
          <p><strong>Estado:</strong> {ticketEncontrado.estado}</p>
          <strong>⚠️ Verifique la información antes de borrar.</strong><br />
          <button className="btn-eliminar" onClick={handleEliminar}>Eliminar Ticket</button>
        </div>
      )}
    </div>
  );
};

export default EliminarTicket;
