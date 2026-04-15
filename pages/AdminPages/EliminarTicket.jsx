import './EliminarTicket.css';
import { useState } from 'react';
import axios from 'axios';

export const EliminarTicket = () => {
  const [idBuscar, setIdBuscar] = useState('');
  const [ticketEncontrado, setTicketEncontrado] = useState(null);
  const [mensaje, setMensaje] = useState('');
  //Importamos la ruta directamente de nuestro file protected, donde tenemos las rutas definidas.
  const buscar_send = import.meta.env.VITE_buscar_send;
  const eliminar_send = import.meta.env.VITE_eliminar_send;


  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setTimeout(() => {
      setMensaje('');
    },4000);
  };

  //Creamos nuestro handler para buscar la información.
  const handleBuscar = async () => {
    //En caso de no ingresar nada, entonces mostramos un mensaje de advertencia
    if (!idBuscar.trim()) {
      mostrarMensaje(' Ingresa un ID para buscar.');
      return;
    }
    //También, que solamente debe de incluir carácteres númericos y no letras
    if (!/^\d+$/.test(idBuscar)) {
      mostrarMensaje("El id debe de ser un número entero.")
      return;
    }
    //Intentamos hacer la petición a nuestro servidor.
    try {
      const response = await axios.get(`${buscar_send}/${idBuscar}`);//Hacemos nuestra petición a nuestra ruta combinando el id que estamos buscando
      if (response.data.estado === 'Pendiente' || 'pendiente') {//Si la respuesta muestra que el estado es pendiente
        setTicketEncontrado(response.data);//Almacenamos entonces el resultado
        mostrarMensaje(`Ticket con id ${idBuscar} encontrado`);
      } else {
        setTicketEncontrado(null);//En caso de no encontrar nada, no lo guardamos
        mostrarMensaje(`El ticket con id ${idBuscar} no fue encontrado`);//Mostramos entonces error al buscar el ticket
        setIdBuscar('');
      }
      //Caemos en la parte del error
    } catch (error) {
      console.error(error);
      setTicketEncontrado(null);
      //En caso de no encontrar el ticket
      if (error.response && error.response.status === 404) {
        setMensaje('Ticket no encontrado.');
      //Error de ticket no encontrado
      } else {
        setMensaje('Error al buscar el ticket.');
      }
    }
  };
  //Este es el handler para eliminar nuestro ticket
  const handleEliminar = async () => {
    try {
      //Esperamos la respuesta de nuestro servidor para la petición de eliminar
      const url = `${eliminar_send}/${ticketEncontrado.idTicket}`;
      const response = await axios.delete(url);
      console.log("Respuesta de la eliminación: ", response);
      mostrarMensaje('Ticket eliminado correctamente.');//Mostramos mensaje en caso de que sea éxitoso la eliminación
      setTicketEncontrado(null);
      setIdBuscar('');
    } catch (error) {
      //En caso de presentar error, lo mostramos con un mensaje y en consola.
      console.error(error);
      mostrarMensaje(' Error al eliminar el ticket.');
    }
  };

  return (
    <div className="eliminar-container">
      <h2>Eliminar Ticket</h2>

      <div className="buscador">
        <input
          type="text"
          placeholder="Ingresa el ID del ticket (solo valores númericos)"
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
          <strong>Verifique la información antes de borrar.</strong><br />
          <button className="btn-eliminar" onClick={handleEliminar}>
            Eliminar Ticket
          </button>
        </div>
      )}
    </div>
  );
};

export default EliminarTicket;
