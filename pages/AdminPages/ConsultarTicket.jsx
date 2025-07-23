import { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './ConsultarTicket.css';

export const ConsultarTicket = () => {
  const [tickets, setTickets] = useState([]);
  //Declaramos nuestra variable para obtener la liga para la petición
  const consultar_send = import.meta.env.VITE_consultar_send;

  useEffect(() => {
    //Declaramos nuestra función fetchTickets para obtener el resultado de nuestra petición
    const fetchTickets = async () => {
      try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const token = usuario?.token;

        if(!token){
          console.warn('No hay token guardado');
          return;
        }
        //Usamos axios para obtener una petición get a nuestro servidor
        const response = await axios.get(consultar_send,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        //Filtramos si el ticket está en pendiente
        const pendientes = response.data.filter(ticket => ticket.estado.toLoweCase()=== 'pendiente');
        //Seteamos el ticket y lo pasamos como parametro
        setTickets(pendientes);
      } catch (error) {
        //Mostramos error en caso de no poder obtener la info del ticket
        console.error('Error al obtener tickets:', error);
      }
    };

    fetchTickets();
  }, []);
   //Declaramos nuestra función para poder exportar nuestras tablas de tickets pendientes
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
          <button className="btn-reportes" onClick={exportarExcel}>
            📥 Generar Reporte Excel
          </button>
        </>
      )}
    </div>
  );
};

export default ConsultarTicket;
