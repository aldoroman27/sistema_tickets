import './EliminarTicket.css';
import { useState } from 'react';
import axios from 'axios';

export const EliminarTicket = () => {
  const [idBuscar, setIdBuscar] = useState('');
  const [ticketEncontrado, setTicketEncontrado] = useState(null);
  const [mensaje, setMensaje] = useState('');
  //Importamos la ruta directamente de nuestro file protected, donde tenemos las rutas definidas.
  const buscar_send = import.meta.env.VITE_buscar_send;
  //Creamos nuestro handler para buscar la información.
  const handleBuscar = async () => {
    //En caso de no ingresar nada, entonces mostramos un mensaje de advertencia
    if (!idBuscar.trim()) {
      setMensaje('⚠️ Ingresa un ID para buscar.');
      return;
    }
    //También, que solamente debe de incluir carácteres númericos y no letras
    if (!/^\d+$/.test(idBuscar)) {
      setMensaje('⚠️ El ID debe ser un número.');
      return;
    }
    //Intentamos hacer la petición a nuestro servidor.
    try {
      const response = await axios.get(`${buscar_send}/${idBuscar}`);//Hacemos nuestra petición a nuestra ruta combinando el id que estamos buscando
      if (response.data.estado === 'pendiente') {//Si la respuesta muestra que el estado es pendiente
        setTicketEncontrado(response.data);//Almacenamos entonces el resultado
        setMensaje('');
      } else {
        setTicketEncontrado(null);//En caso de no encontrar nada, no lo guardamos
        setMensaje('❌ El ticket no está pendiente o ya fue completado.');//Mostramos entonces error al buscar el ticket
      }
      //Caemos en la parte del error
    } catch (error) {
      console.error(error);
      setTicketEncontrado(null);
      //En caso de no encontrar el ticket
      if (error.response && error.response.status === 404) {
        setMensaje('❌ Ticket no encontrado.');
      //Error de ticket no encontrado
      } else {
        setMensaje('❌ Error al buscar el ticket.');
      }
    }
  };
  //Este es el handler para eliminar nuestro ticket
  const handleEliminar = async () => {
    try {
      //Esperamos la respuesta de nuestro servidor para la petición de eliminar
      await axios.delete(`${buscar_send}${ticketEncontrado.idTicket}`);
      setMensaje('✅ Ticket eliminado correctamente.');//Mostramos mensaje en caso de que sea éxitoso la eliminación
      setTicketEncontrado(null);
      setIdBuscar('');
    } catch (error) {
      //En caso de presentar error, lo mostramos con un mensaje y en consola.
      console.error(error);
      setMensaje('❌ Error al eliminar el ticket.');
    }
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
          <button className="btn-eliminar" onClick={handleEliminar}>
            Eliminar Ticket
          </button>
        </div>
      )}
    </div>
  );
};

export default EliminarTicket;
