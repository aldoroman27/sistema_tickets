import './BuscarTicket.css';
import { useState } from 'react';
import axios from 'axios';

export const BuscarTicket = () => {
  const [idBuscar, setIdBuscar] = useState('');
  const [ticket, setTicket] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const buscar_send = import.meta.env.VITE_buscar_send;
  //Este es nuestro handler para buscar información
  const handleBuscar = async () => {
    if (!/^\d+$/.test(idBuscar)) {//Definimos que solamente sean carácteres númericos.
      setMensaje('⚠️ Ingresa un ID numérico válido');//Mostramos error en caso que se intente ingresar otra cosa
      setTicket(null);
      return;
    }
    //En caso de que se introduza información, verificamos dentro de nuestro servidor
    try {
      const response = await axios.get(`${buscar_send}/${idBuscar}`);//Esperamos una respuesta del servidor usando axios.
      setTicket(response.data);//Recuperamos la información del ticket para mostrarlo
      setMensaje('');
    } catch (error) {//En caso de fallar o de error mostramos el respectivo mensaje
      console.error(error);
      setTicket(null);//No seteamos nada dentro de nuestra función
      if (error.response && error.response.status === 404) {
        setMensaje('❌ Ticket no encontrado.');//En caso de que la información sea erronea, mostramos el respectivo mensaje de error
      } else {
        setMensaje('❌ Error al conectar con el servidor.');//Error si es que el servidor no está OK.
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

