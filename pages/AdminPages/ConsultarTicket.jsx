import { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './ConsultarTicket.css';

export const ConsultarTicket = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tickets');
        const pendientes = response.data.filter(ticket => ticket.estado === 'pendiente');
        setTickets(pendientes);
      } catch (error) {
        console.error('Error al obtener tickets:', error);
      }
    };

    fetchTickets();
  }, []);

  const exportarExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(tickets);//Generamos una tabla usando la información que nos llegó en formato JSON.
    const workbook = XLSX.utils.book_new();//Generamos un libro nuevo
    XLSX.utils.book_append_sheet(workbook, worksheet, "TicketsPendientes");//Asignamos el nombre del libro

    XLSX.writeFile(workbook, "tickets_pendientes.xlsx");//Finalmente creamos un archivo con ese nombre
  };

  return (
    <div className="consultar-container">
      <h2>Tickets Pendientes</h2>

      {tickets.length === 0 ? (
        <p>No hay tickets pendientes actualmente.</p>
      ) : (
        <>
          <table className="tabla-tickets">
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
              {tickets.map(ticket => (
                <tr key={ticket.id}>
                  <td>{ticket.idTicket}</td>
                  <td>{ticket.nombreCompleto}</td>
                  <td>{ticket.id}</td>
                  <td>{ticket.departamento}</td>
                  <td>{ticket.equipo}</td>
                  <td>{ticket.descripcion}</td>
                  <td>{ticket.fecha}</td>
                  <td>{ticket.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn-reportes" onClick={exportarExcel}>
            📥 Generar Reporte Excel
          </button>
        </>
      )}
    </div>
  );
};

export default ConsultarTicket;

