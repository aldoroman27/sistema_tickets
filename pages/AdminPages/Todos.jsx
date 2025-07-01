import axios from 'axios';
import { useEffect, useState } from 'react';
import './Todos.css'

export const Todos = () => {
  const [allTickets, setTickets] = useState([]);
  const [mensaje, setMensaje] = useState('');
  //Importamos de nuestras varibales ocultas
  const consultar_send = import.meta.env.VITE_consultar_send;

  useEffect(() => {
    const obtenerallTickets = async () => {
      //Intentamos obtner respuesta por parte de nuestro servidor
      try {
        //Obtenemos una respuesta haciendo una petición a nuestro URL
        const response = await axios.get(consultar_send);
        //Si es un conjunto de información, entonces lo almacenamos
        if (Array.isArray(response.data)) {
          setTickets(response.data);//Almacenamos para obtner los tickets en una variable
        } else {//En caso contrario, marcamos error
          setMensaje('❌ Error en el formato de los datos recibidos.');
        }
      } catch (error) {//Si llegamos a tener error en algún momento de ejecución entonces mosrtramos el error.
        console.error(error);
        setMensaje('❌ Error al obtener tickets.');
      }
    };

    obtenerallTickets();
  }, []);

  return (
    <div className="allTickets-container">
      <h2>Mostrando Todos los Tickets</h2>

      {mensaje && <p>{mensaje}</p>}

      {allTickets.length === 0 && !mensaje ? (
        <p>No hay tickets actualmente.</p>
      ) : (
        <>
          <table className="tabla-allTickets">
            <thead>
              <tr>
                <th>ID Ticket</th>
                <th>Empleado</th>
                <th>ID Empleado</th>
                <th>Departamento</th>
                <th>Equipo</th>
                <th>Descripción</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {allTickets.map(ticket => (
                <tr key={ticket.idTicket}>
                  <td>{ticket.idTicket}</td>
                  <td>{ticket.nombreCompleto}</td>
                  <td>{ticket.idEmpleado}</td>
                  <td>{ticket.departamento}</td>
                  <td>{ticket.equipo}</td>
                  <td>{ticket.descripcion}</td>
                  <td>{ticket.fecha}</td>
                  <td>{ticket.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}

export default Todos;