import './LiberarTicket.css';
import { useState } from 'react';
import axios from 'axios';

//Definimos nuestro componente LiberarTicket
export const LiberarTicket = () => {
  const [idBuscar, setIdBuscar] = useState('');
  const [ticketEncontrado, setTicketEncontrado] = useState(null);
  const [mensaje, setMensaje] = useState('');
  //Definimos nuestra ruta para acceder a ella más adelante.
  const liberar_send = import.meta.env.VITE_liberar_send;
  const buscar_send = import.meta.env.VITE_buscar_send;
  const handleBuscar = async () => {
    //Si es que la entrada es una cadena vacía, entonces solicitamos que se ingresen los datos
    if (!idBuscar.trim()) {
      setMensaje('⚠️ Ingresa un ID para buscar.');
      return;
    }
    //Si es que intentan ingresar un ID que no sea un número saltará este mensaje.
    if (!/^\d+$/.test(idBuscar)) {
      setMensaje('⚠️ El ID debe ser un número.');
      return;
    }
    //Usamos try y catch para intentar hacer la petición, en caso de caer en error saltaremos a la línea de catch
    try {
      //Mandamos una petición GET a nuestro servidor para obtner los datos de nuestro ticket 
      const response = await axios.get(`${buscar_send}/${idBuscar}`);
      //El valor de nuestro ticket será la respuesta que nos dió nuestra petición
      const ticket = response.data;

      //Si el estado del ticket es pendiente entonces lo almacenamos en nuestra varibale.
      if (ticket.estado === 'pendiente') {
        setTicketEncontrado(ticket);
        setMensaje('');
      //En caso contrario mostraremos que el ticket ya está completado.
      } else {
        setTicketEncontrado(null);
        setMensaje('❌ El ticket ya está completado.');
      }
    //En caso de tener error en la búsqueda
    } catch (error) {
      console.error(error);//Mostramos error en la consola
      setTicketEncontrado(null);//No definimos un set para nuestro seter
      if (error.response && error.response.status === 404) {//Mostramos error 404.
        setMensaje('❌ Ticket no encontrado.');//Mostramos error de que el ticket no fue encontrado
      } else {
        setMensaje('❌ Error al buscar el ticket.');//Si tenemos error en el servidor mostramos directamente este mensaje
      }
    }
  };

  //Declaramos nuestro Handler para liberar tickets
  const handleLiberar = async () => {
    try {
      //Esperamos una respuesta de nuestra petición PUT
      await axios.put(`${liberar_send}/${ticketEncontrado.idTicket}`, {
        estado: 'completado'//Cambiamos el estado a completado
      });
      //Mostramos mensaje de que el ticket fue liberado correctamente
      setMensaje('✅ Ticket liberado correctamente.');
      setTicketEncontrado(null);//Limpiamos
      setIdBuscar('');//Limpiamos nuestras variables
    } catch (error) {//En caso de fallar
      console.error(error);//Mostramos el error en consola
      setMensaje('❌ Error al liberar el ticket.');//Mostramos error al usuario de que falló el proceso.
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
