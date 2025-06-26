import './Resueltos.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

export const Resueltos = () => {
  const [ticketsCompletados, setTicketsCompletados] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const obtenerTicketsCompletados = async () => {
      try {
        const response = await axios.get('http://localhost:5000/ticket/completados');
        if (Array.isArray(response.data)) {
          setTicketsCompletados(response.data);
        } else {
          setMensaje('❌ Error en el formato de los datos recibidos.');
        }
      } catch (error) {
        console.error(error);
        setMensaje('❌ Error al obtener tickets completados.');
      }
    };

    obtenerTicketsCompletados();
  }, []);

  return (
    <div className="completados-container">
      <h2>Tickets Completados</h2>

      {mensaje && <p>{mensaje}</p>}

      {ticketsCompletados.length === 0 && !mensaje ? (
        <p>No hay tickets completados actualmente.</p>
      ) : (
        <table className="tabla-tickets-completados">
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
            {ticketsCompletados.map(ticket => (
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
      )}
    </div>
  );
};

export default Resueltos;
