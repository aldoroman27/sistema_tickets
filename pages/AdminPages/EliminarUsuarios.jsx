import {  useState } from 'react';
import axios from 'axios';
import './EliminarUsuarios.css';

export const EliminarUsuarios = () => {
    const [idBuscar, setIdBuscar] = useState('');
    const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);
    const [mensaje, setMensaje] = useState('')

    //Importamos las rutas para hacer las peticiones a nuestro servidor
    const buscar_send = import.meta.env.VITE_buscarUsuario_send;
    const eliminar_send = import.meta.env.VITE_eliminarUsuario_send;

    const handleBuscar = async () => {
        if(!idBuscar.trim()){
            setMensaje('Ingrese un ID para realizar la búsqueda.');
            return;
        }
        if(!/^\d+$/.test(idBuscar)){
            setMensaje('El ID debe de ser un valor númerico.');
            return;
        }

        try{
            const response = await axios.get(`http://127.0.0.1:5000/buscarUsuarios/${idBuscar}`);
            setUsuarioEncontrado(response.data);
        }catch(err){
            setUsuarioEncontrado(null);
            setMensaje("Usuario no encontrado")
        }
    };

    const handleEliminar = async () => {
        try{
            const url = `http://127.0.0.1:5000/eliminarUsuarios/${usuarioEncontrado.idUsuario}`;
            const response = await axios.delete(url);
            setMensaje('Usuario eliminado correctamente!');
            setUsuarioEncontrado(null);
            setIdBuscar('');
        }catch(error){
            setMensaje('Error al eliminar el Usuario')
        }
    }


  return (
    <div className='eliminarUsuario-container'>
        <h2>Eliminar usuario</h2>
        <div className='buscador-eliminar'>
            <input
                type='text'
                placeholder='Ingrese el ID del empleado'
                value={idBuscar}
                onChange={(e) => setIdBuscar(e.target.value)}
            />
            <button onClick={handleBuscar}>Buscar Empleado</button>
        </div>

        {mensaje && <p className='mensaje'>{mensaje}</p>}

        {usuarioEncontrado && (
            <div className='user-info'>
                 <strong className='delete-info'>Verifique que sea el usuario que desea eliminar</strong><br />
                <p><strong>ID empleado: </strong> {usuarioEncontrado.idEmpleado}</p>
                <p><strong>Nombre Empleado: </strong>{usuarioEncontrado.nombre}</p>
                <p><strong>Nivel de permisos: </strong>{usuarioEncontrado.admin}</p>
                <button className='btn-eliminar' onClick={handleEliminar}>
                    Eliminar usuario
                </button>
            </div>
        )}
    </div>
  )
}

export default EliminarUsuarios;
