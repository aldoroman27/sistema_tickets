import './Tickets.css';
import { useState, useEffect } from 'react';

export const Tickets = () => {

  //Datos del ticket que estamos enviando, se mostrará en consola si es que se están enviando correctamente
  const [ticketData, setTicketData] = useState({
    idEmpleado: '',
    nombreCompleto: '',
    correoElectronico: '',
    departamento: '',
    equipo: '',
    descripcion: '',
    fecha: '',
  });
  //Mensaje de registro éxitoso de nuestro ticket
  const [mensajeExito, setMensajeExito] = useState('');

  useEffect(() => {
    // Genera la fecha actual automáticamente al cargar el componente
    const fechaActual = new Date().toISOString().split('T')[0]; // formato YYYY-MM-DD
    setTicketData(prev => ({ ...prev, fecha: fechaActual }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del ticket:', ticketData);

    // Mostrar mensaje de éxito
    setMensajeExito('✅ Ticket enviado correctamente');

    // Limpiar los campos (excepto la fecha)
    setTicketData(prev => ({
        idEmpleado: '',
        nombreCompleto: '',
        departamento: '',
        equipo: '',
        descripcion: '',
        fecha: prev.fecha, // mantenemos la fecha actual
  }));

  // Ocultar mensaje después de unos segundos (opcional)
  setTimeout(() => setMensajeExito(''), 3000);
  };

  return (
    <div className="container">
      <div>
        <h1>Generar Ticket</h1>
        {mensajeExito && (
        <div className="mensaje-exito">
            {mensajeExito}
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
            <option value="Licencias">Licencias</option>
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
      </div>
    </div>
  );
};

export default Tickets;
