import './Tickets.css';
import { useState, useEffect } from 'react';
import axios from 'axios';


export const Tickets = () => {
  const registrar_send = import.meta.env.VITE_registrarTicket_send;
  //Datos del ticket que estamos enviando, se mostrará en consola si es que se están enviando correctamente
  const [ticketData, setTicketData] = useState({
    idTicket: '',
    //idEmpleado: '',
    nombreCompleto: '',
    correoElectronico: '',
    departamento: '',
    equipo: '',
    descripcion: '',
    fecha: '',
    status: 'Pendiente'
  });
  //Mensaje de registro éxitoso de nuestro ticket
  const [mensajeExito, setMensajeExito] = useState('');
  const[idGenerado, setIdGenerado] = useState(null);
  const [errores, setErrores] = useState([]);
  useEffect(() => {
    // Genera la fecha actual automáticamente al cargar el componente
    const fechaActual = new Date().toISOString().split('T')[0]; // formato YYYY-MM-DD
    setTicketData(prev => ({ ...prev, fecha: fechaActual }));
  }, []);

   const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores([]);
    setMensajeExito('');
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      const token = usuario?.token;
      const response = await axios.post(
        registrar_send, 
        ticketData,
      {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
      }
    );
      console.log(response.data);
      console.log('Ticket generado',ticketData);
      setIdGenerado(response.data.idTicket); // Si tu backend regresa el ID, puedes mostrarlo aquí
      setMensajeExito('✅ Ticket enviado correctamente');
      setIdGenerado(response.data.idTicket);
      setTicketData(prev => ({
        idEmpleado: '',
        nombreCompleto: '',
        correoElectronico: '',
        departamento: '',
        equipo: '',
        descripcion: '',
        fecha: prev.fecha,
        estado: 'pendiente'
      }));
      setTimeout(() => {
        setMensajeExito('');
      }, 4000);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const data = error.response.data;
      if (Array.isArray(data.errores)) {
        setErrores(data.errores);
      } else {
        setErrores(['⚠️ Error de validación desconocido.']);
      }
      } else {
        setErrores(['❌ Error al conectar con el servidor.']);
      }
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketData(prev => ({ ...prev, [name]: value }));
  };
  return (
    <div className="container">
      <div>
        <h1>Generar Ticket</h1>
        <h2 className='avisoImportante'>Aviso importante</h2>
        <h3>Antes de generar un ticket, verifique que las conexiones del dispositivo sean correctas y haber reiniciado la computadora antes. Si el problema persiste entonces genere el ticket.</h3>
        {mensajeExito && (
        <div className="mensaje-exito">
            {mensajeExito}
        </div>
        )}
        {idGenerado && (
          <div className="modal-exito">
            <h2>✅ Ticket enviado correctamente</h2>
            <p><strong>CONSERVE SU ID DE TICKET:</strong></p>
            <div className="id-ticket">{idGenerado}</div>
            <button className="btn-continuar" onClick={() => setIdGenerado(null)}>
              Continuar
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="idEmpleado"
            placeholder="ID de empleado"
            value={ticketData.idEmpleado}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="nombreCompleto"
            placeholder="Nombre completo"
            value={ticketData.nombreCompleto}
            onChange={handleChange}
            required
          />
          <input
            type='text'
            name="correoElectronico"
            placeholder='Correo Electronico'
            value={ticketData.correoElectronico}
            onChange={handleChange}
            required
            
          />

          <select
            name="departamento"
            value={ticketData.departamento}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un departamento</option>
            <option value="Contabilidad">Contabilidad</option>
            <option value="Recursos Humanos">Recursos Humanos</option>
            <option value="Compras">Compras</option>
            <option value="Ventas">Ventas</option>
            <option value="Sistemas">Sistemas</option>
            <option value="Calidad">Calidad</option>
            <option value="Maquinados">Maquinados</option>
            <option value="Diseño mecanico">Diseño Mecanico</option>
            <option value="A&C">Automatización y control</option>
            <option value="Prooyectos">Proyectos</option>

          </select>

          <select
            name="equipo"
            value={ticketData.equipo}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un equipo/sistema</option>
            <option value="Laptop">Laptop</option>
            <option value="PC">PC</option>
            <option value="Mouse">Mouse</option>
            <option value="Teclado">Teclado</option>
            <option value="Audífonos">Audífonos</option>
            <option value="Licencias">Licencias de Software</option>
            <option value="Solicitar equipo de cómputo">Solicitar equipo de cómputo</option>
            <option value="Red">Red</option>
            <option value="Otro">Otro</option>
          </select>

          <input
            type="text"
            name="descripcion"
            placeholder="Descripción del problema"
            value={ticketData.descripcion}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="fecha"
            value={ticketData.fecha}
            readOnly
          />

          <button type="submit">Enviar Ticket</button>
        </form>
        {errores.length > 0 && (
        <div className="errores">
          <ul>
            {errores.map((error, idx) => (
              <li key={idx} className="error-item">❌ {error}</li>
            ))}
          </ul>
        </div>
        )}
      </div>
    </div>
  );
};

export default Tickets;
