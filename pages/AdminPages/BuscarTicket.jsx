import './BuscarTicket.css';
import { useState } from 'react';
import { useTickets } from '../../src/context/ticketContext';

export const BuscarTicket = () => {
  const { tickets } = useTickets();
  const [idBuscar, setIdBuscar] = useState('');
  const [ticket, setTicket] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const handleBuscar = () => {
    if (!/^\d+$/.test(idBuscar)) {
      setMensaje('⚠️ Ingresa un ID numérico válido');
      setTicket(null);
      return;
    }

    const resultado = tickets.find(t => String(t.idTicket) === idBuscar);

    if (resultado) {
      setTicket(resultado);
      setMensaje('');
    } else {
      setTicket(null);
      setMensaje('❌ Ticket no encontrado.');
    }
  };

  return (
    <div className="buscar-container">
      <h2>Buscar Ticket</h2>

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

      {ticket && (
        <div className="ticket-info">
          <p><strong>ID Ticket:</strong> {ticket.idTicket}</p>
          <p><strong>Empleado:</strong> {ticket.nombreCompleto}</p>
          <p><strong>Departamento:</strong> {ticket.departamento}</p>
          <p><strong>Equipo:</strong> {ticket.equipo}</p>
          <p><strong>Descripción:</strong> {ticket.descripcion}</p>
          <p><strong>Fecha:</strong> {ticket.fecha}</p>
          <p><strong>Estado:</strong> {ticket.estado}</p>
        </div>
      )}
    </div>
  );
};

export default BuscarTicket;
