import axios from 'axios';
import { useState, useEffect } from 'react';
import './ViewTicket.css'; // si tienes estilos

export const ViewTicket = () => {
  const [idUsuario, setIdUsuario] = useState('');
  const [tickets, setTickets] = useState([]);
  const [cargando, setCargando] = useState(true);
  //Vamos a cargar al usuario para poder trabajar con su información
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');//Obtenemos al usuario
    if (usuarioGuardado) {//En caso de que se guardara correctamente ejecutamos el siguiente bloque de instrucciones
      try {
        const usuario = JSON.parse(usuarioGuardado);//Guardamos el usuario
        const id = usuario.id;//Obtenemos entonces el id del usuario para poder trabajar con ella.
        setIdUsuario(id);//Seteamos entonces la información de nuestro usuario usando entonces el setter.
        console.log('Contenido de localstorage:', localStorage.getItem('usuario'));
        // Obtenemos los tickets de nuestro backend usando el id de nuestro usuario
        axios.get(`http://localhost:5000/tickets/usuario/${id}`)
          .then((response) => {
            setTickets(response.data);//Almacenamos la información de nuestra petición.
            setCargando(false);
          })
          //En caso de caer en erorr, entonces
          .catch((error) => {
            console.error('Error al obtener los tickets:', error);//Mostramos en consola que tuvimos error
            setCargando(false);
          });

      } catch (e) {
        console.error('Usuario en localStorage no es válido:', e);
        setCargando(false);
      }
    }
  }, []);

  return (
    <div className="view-ticket-container">
      <h2> Tus Tickets Registrados</h2>

      {cargando ? (
        <p>Cargando tickets...</p>
      ) : tickets.length === 0 ? (
        <p>No tienes tickets registrados.</p>
      ) : (
        <table className="tabla-tickets">
          <thead>
            <tr>
              <th>ID Ticket</th>
              <th>Nombre-Solicitante</th>
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

export default ViewTicket;
