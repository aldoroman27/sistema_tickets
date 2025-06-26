import './BuscarTicket.css';
import { useState } from 'react';
import axios from 'axios';

export const BuscarTicket = () => {
  const [idBuscar, setIdBuscar] = useState('');
  const [ticket, setTicket] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const handleBuscar = async () => {
    if (!/^\d+$/.test(idBuscar)) {
      setMensaje('⚠️ Ingresa un ID numérico válido');
      setTicket(null);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/tickets/${idBuscar}`);
      setTicket(response.data);
      setMensaje('');
    } catch (error) {
      console.error(error);
      setTicket(null);
      if (error.response && error.response.status === 404) {
        setMensaje('❌ Ticket no encontrado.');
      } else {
        setMensaje('❌ Error al conectar con el servidor.');
      }
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

