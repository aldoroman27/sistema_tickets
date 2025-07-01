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
        <button onClick={handleBuscar}>Buscar</button>{/*Invocamos al handler de nuestro botón Buscar que mandará el ID del ticket que estemos buscando*/}
      </div>

      {mensaje && <p className="mensaje">{mensaje}</p>}

      {ticket && (
        <div className="ticket-info">
          <p><strong>ID Ticket:</strong> {ticket.idTicket}</p> {/*Mostramos el ID del ticket*/}
          <p><strong>Empleado:</strong> {ticket.nombreCompleto}</p>{/*Mostramos el nombre del empleado*/}
          <p><strong>Departamento:</strong> {ticket.departamento}</p>{/*Mostramos el departamento del usuario que levantó el ticket*/}
          <p><strong>Equipo:</strong> {ticket.equipo}</p>{/*Mostramos el équipo que presenta falla*/}
          <p><strong>Descripción:</strong> {ticket.descripcion}</p>{/*Mostramos la descripción del fallo o de la solicitud*/}
          <p><strong>Fecha:</strong> {ticket.fecha}</p>{/*Mostramos la fecha en la que fue solicitada*/}
          <p><strong>Estado:</strong> {ticket.estado}</p>{/*Mostramos el estado actual del ticket*/}
        </div>
      )}
    </div>
  );
};

export default BuscarTicket;

