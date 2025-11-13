import './ModificarUsuarios.css';
import {  use, useState  } from 'react';
import axios from 'axios';

export const ModificarUsuarios = () => {
    const [idBuscar, setIdBuscar] = useState('');
    const [usuario, setUsuario] = useState(null);
    const [mensaje, setMensaje] = useState('');

    const buscar_send = import.meta.env.VITE_buscar_send;
    const modificar_send = import.meta.env.VITE_modificar_send;

    const handleBuscar = async () => {
        if (!/^\d+$/.test(idBuscar)){
            setMensaje('Ingrese un id con valores númericos');
            return;
        }
        try{
            const response = await axios.get(`http://127.0.0.1:5000/buscarUsuarios/${idBuscar}`);
            setUsuario(response.data);
            setMensaje('');
        }catch(error){
            setUsuario(null);
            if (error.response && error.response.status === 404){
                setMensaje('Ticket no encontrado');
            }else{
                setMensaje('Error en la búsqueda del ticket');
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsuario(prev => ({...prev, [name]:value}));
    };

    const handleGuardar = async () => {
        try{
            const datosModificados = {
                nombre: usuario.nombre,
                idEmpleado: usuario.idEmpleado,
                password: usuario.password_hash,
                permisos: usuario.admin
            };
        }catch(error){
            setMensaje('Error al guardar los cambios.');
        }
    }


  return (
    <div>ModificarUsuarios</div>
  )
}

export default ModificarUsuarios