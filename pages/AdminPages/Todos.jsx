import axios from 'axios';
import { useEffect, useState } from 'react';
import './Todos.css'

export const Todos = () => {
  const [allTickets, setTickets] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const obtenerallTickets = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tickets');
        if (Array.isArray(response.data)) {
          setTickets(response.data);
        } else {
          setMensaje('❌ Error en el formato de los datos recibidos.');
        }
      } catch (error) {
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