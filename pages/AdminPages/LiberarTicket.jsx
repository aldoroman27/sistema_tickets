import './LiberarTicket.css';
import { useState } from 'react';
import axios from 'axios';

export const LiberarTicket = () => {
  const [idBuscar, setIdBuscar] = useState('');
  const [ticketEncontrado, setTicketEncontrado] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const handleBuscar = async () => {
    if (!idBuscar.trim()) {
      setMensaje('⚠️ Ingresa un ID para buscar.');
      return;
    }

    if (!/^\d+$/.test(idBuscar)) {
      setMensaje('⚠️ El ID debe ser un número.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/tickets/${idBuscar}`);
      const ticket = response.data;

      if (ticket.estado === 'pendiente') {
        setTicketEncontrado(ticket);
        setMensaje('');
      } else {
        setTicketEncontrado(null);
        setMensaje('❌ El ticket ya está completado.');
      }
    } catch (error) {
      console.error(error);
      setTicketEncontrado(null);
      if (error.response && error.response.status === 404) {
        setMensaje('❌ Ticket no encontrado.');
      } else {
        setMensaje('❌ Error al buscar el ticket.');
      }
    }
  };

  const handleLiberar = async () => {
    try {
      await axios.put(`http://localhost:5000/tickets/${ticketEncontrado.idTicket}`, {
        estado: 'completado'
      });
      setMensaje('✅ Ticket liberado correctamente.');
      setTicketEncontrado(null);
      setIdBuscar('');
    } catch (error) {
      console.error(error);
      setMensaje('❌ Error al liberar el ticket.');
    }
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
          <p><strong>Id Ticket:</strong> {ticketEncontrado.idTicket}</p>
          <p><strong>Empleado:</strong> {ticketEncontrado.nombreCompleto}</p>
          <p><strong>Equipo:</strong> {ticketEncontrado.equipo}</p>
          <p><strong>Descripción:</strong> {ticketEncontrado.descripcion}</p>
          <p><strong>Estado:</strong> {ticketEncontrado.estado}</p>

          <button className="btn-liberar" onClick={handleLiberar}>
            Marcar como Completado
          </button>
        </div>
      )}
    </div>
  );
};

export default LiberarTicket;
