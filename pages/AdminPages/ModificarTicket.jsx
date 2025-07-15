import './ModificarTicket.css';
import { useState } from 'react';
import axios from 'axios';

//Definimos nuestro componente ModificarTicket
export const ModificarTicket = () => {
  const [idBuscar, setIdBuscar] = useState('');
  const [ticket, setTicket] = useState(null);
  const [mensaje, setMensaje] = useState('');
  //Definimos nuestra ruta de petición al servidor para realizar las peticiones.
  const buscar_send = import.meta.env.VITE_buscar_send;
  //Definimos nuestro handler para Buscar nuestro ticket
  const handleBuscar = async () => {
    //Si es que no es un valor númerico entonces mostramos error
    if (!/^\d+$/.test(idBuscar)) {
      setMensaje('⚠️ Ingresa un ID numérico válido');//Deberá de ingresar un dato que sea númerico
      return;//Retornamos
    }
    //En caso de que sea un valor correcto pasamos al bloque de try y catch
    try {
      //Hacemos la petición a nuestro servidor usando GET, la ruta y nuestro id a buscar.
      const response = await axios.get(`${buscar_send}/${idBuscar}`);
      //Con la información recuperada, lo guardamos para setear un nuevo ticket y poder trabajar con la información que nos dejó
      setTicket(response.data);//Usamos estonces la información que nos da nuestra respuesta de la petición.
      setMensaje('');//Seteamos nuestro mensaje.
    } catch (error) {//En caso de caer en error
      console.error(error);//Mostramos el error dentro de la consola
      setTicket(null);//No seteamos nada nuestro seter de tickets
      if (error.response && error.response.status === 404) {//Si hubo error por algunas de las dos condicionales entonces mostramos el mensaje
        setMensaje('❌ Ticket no encontrado.');//Mostramos entonces el mensaje de error
      } else {
        setMensaje('❌ Error al buscar el ticket.');//Mostramos error si la falla fue dentro del servidor.
      }
    }
  };
  //Usamos el handler para el cambio y lo almacenamos en nuestro setter otra vez.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicket(prev => ({ ...prev, [name]: value }));
  };
  //Ahora declaramos nuestro handler para guardar la información que queremos mandar.
  const handleGuardar = async () => {
    try {
      const datosModificados = {
        nombreCompleto: ticket.nombreCompleto,
        departamento: ticket.departamento,
        equipo: ticket.equipo,
        descripcion: ticket.descripcion
        // Se pueden incluir más campos, se deberá de modificar la esctructura de nuestro componente más abajo ->
      };
      //Esperamos una respuesta de nuestro servidor con PUT y mandando los datosModificados junto con la petición.
      await axios.put(`${buscar_send}/${ticket.idTicket}`, datosModificados);
      //En caso de tener éxito le mostramos al usuario que tuvimos éxito realizando la operación.
      setMensaje('✅ Cambios guardados correctamente.');
      //Limpiamos nuestro setter de nuestro ticket.
      setTicket(null);
      //Limpiamos el id a buscar.
      setIdBuscar('');
    } catch (error) {//En caso de fallar entonces hacemos un catch del error.
      console.error(error);//Mostramos el error ocurrido dentro de nuestra consola.
      setMensaje('❌ Error al guardar los cambios.');//Mostramos el error en nuestro setter.
    }
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
            <option value="Diseño mecanico">Diseño Mecánico</option>
            <option value="A&C">Automatización y Control</option>
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
