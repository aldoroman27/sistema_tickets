import './ModificarTicket.css';
import { useState } from 'react';
import { useTickets } from '../../src/context/ticketContext';

export const ModificarTicket = () => {
  const { tickets, modificarTicket } = useTickets();
  const [idBuscar, setIdBuscar] = useState('');
  const [ticket, setTicket] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const handleBuscar = () => {
    if (!/^\d+$/.test(idBuscar)) {
      setMensaje('⚠️ Ingresa un ID numérico válido');
      return;
    }

    const encontrado = tickets.find(t => String(t.idTicket) === idBuscar);
    if (encontrado) {
      setTicket(encontrado);
      setMensaje('');
    } else {
      setTicket(null);
      setMensaje('❌ Ticket no encontrado.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicket(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardar = () => {
    modificarTicket(ticket.idTicket, ticket);
    setMensaje('✅ Cambios guardados correctamente.');
    setIdBuscar('');
    setTicket(null);
  };

  return (
    <div className="modificar-container">
      <h2>Modificar Ticket</h2>

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

      {ticket && (
        <div className="formulario-modificacion">
          <p><strong>ID Ticket:</strong> {ticket.idTicket}</p>

          <input
            type="text"
            name="nombreCompleto"
            value={ticket.nombreCompleto}
            onChange={handleChange}
          />

          <select name="departamento" value={ticket.departamento} onChange={handleChange}>
            <option value="">Selecciona departamento</option>
            <option value="Contabilidad">Contabilidad</option>
            <option value="Recursos Humanos">Recursos Humanos</option>
            <option value="Compras">Compras</option>
            <option value="Ventas">Ventas</option>
            <option value="Sistemas">Sistemas</option>
            <option value="Calidad">Calidad</option>
            <option value="Maquinados">Maquinados</option>
            <option value="Diseño mecanico">Diseño Mecanico</option>
            <option value="A&C">Automatización y control</option>
            <option value="Proyectos">Proyectos</option>
          </select>

          <select name="equipo" value={ticket.equipo} onChange={handleChange}>
            <option value="">Selecciona un equipo</option>
            <option value="Laptop">Laptop</option>
            <option value="PC">PC</option>
            <option value="Mouse">Mouse</option>
            <option value="Teclado">Teclado</option>
            <option value="Audífonos">Audífonos</option>
            <option value="Licencias">Licencias</option>
            <option value="Red">Red</option>
            <option value="Otro">Otro</option>
          </select>

          <textarea
            name="descripcion"
            value={ticket.descripcion}
            onChange={handleChange}
            rows="3"
            placeholder="Descripción del problema"
          />

          <button className="btn-guardar" onClick={handleGuardar}>Guardar Cambios</button>
        </div>
      )}
    </div>
  );
};

export default ModificarTicket;
