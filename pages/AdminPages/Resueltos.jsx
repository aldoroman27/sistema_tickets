import './Resueltos.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
//Comenzamos entonces con la estructura de nuestro componente de Resueltos.
export const Resueltos = () => {
  const [ticketsCompletados, setTicketsCompletados] = useState([]);
  const [mensaje, setMensaje] = useState('');
  //Importamos la ruta que necesitamos para hacer la petición a nuestro servidor.
  const completados_send = import.meta.env.VITE_completados_send;

  useEffect(() => {
    //Declaramos nuestra función para obtner los tickets completados.
    const obtenerTicketsCompletados = async () => {
      try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const token = usuario?.token;

        if(!token){
          console.warn('No hay token guardado');
          return;
        }
        //Esperamos la respuesta de nuestra petición GET y la almacenamos en una variable.
        const response = await axios.get(completados_send,{
          headers:{
            Authorization: `Bearer ${token}`
          }
        });
        if (Array.isArray(response.data)) {//Si la respuesta que obtenemos es un array de datos entonces
          setTicketsCompletados(response.data);//Almacenamos esa información.
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

  const exportarExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(ticketsCompletados);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook,worksheet,"TicketsPendientes");
    XLSX.writeFile(workbook, "tickets_completados.xlsx");
  };

  return (
    <div className="completados-container">
      <h2>Tickets Completados</h2>

      {mensaje && <p>{mensaje}</p>}

      {ticketsCompletados.length === 0 && !mensaje ? (
        <p>No hay tickets completados actualmente.</p>
      ) : (
        <>
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
          <button className='btn-reportes' onClick={exportarExcel}>
            Generar Reporte Excel.
          </button>
        </>
      )}
    </div>
  );
};

export default Resueltos;
