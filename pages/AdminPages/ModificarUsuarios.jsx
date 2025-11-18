import './ModificarUsuarios.css';
import { useState } from 'react';
import axios from 'axios';
import { Wrench } from 'phosphor-react'

export const ModificarUsuarios = () => {
    const [idBuscar, setIdBuscar] = useState('');
    const [usuario, setUsuario] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const buscar_send = import.meta.env.VITE_buscarUsuario_send;

    const handleBuscar = async () => {
        if (!/^\d+$/.test(idBuscar)) {
            setMensaje('Ingrese un ID numérico válido.');
            return;
        }

        try {
            const response = await axios.get(
                `${buscar_send}/${idBuscar}`
            );
            setUsuario(response.data);
            setMensaje('');
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            setUsuario(null);
            if (error.response && error.response.status === 404) {
                setMensaje('Usuario no encontrado.');
            } else {
                setMensaje('Ocurrió un error al buscar el usuario.');
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsuario((prev) => ({ ...prev, [name]: value }));
    };

    const handleGuardar = async () => {
        if (password !== confirmPassword) {
            setMensaje('Las contraseñas no coinciden.');
            return;
        }

        try {
            const datosModificados = {
                nombre: usuario.nombre,
                idEmpleado: usuario.idEmpleado,
                password: password || null,
                permisos: usuario.admin,
            };

            await axios.put(
                `http://127.0.0.1:5000/modificarUsuarios/${idBuscar}`,
                datosModificados
            );

            setMensaje('Cambios guardados correctamente.');
            setUsuario(null);
            setIdBuscar('');
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            setMensaje('Error al guardar los cambios.');
        }
    };

    return (
        <div className="modificar-usuario-container">
            <h2><Wrench size={32}/> Modificar Usuario</h2>

            <div className="buscador">
                <input
                    type="text"
                    placeholder="ID del usuario"
                    value={idBuscar}
                    onChange={(e) => setIdBuscar(e.target.value)}
                />
                <button onClick={handleBuscar}>Buscar</button>
            </div>

            {mensaje && <p className="mensaje">{mensaje}</p>}

            {usuario && (
                <div className="formulario-modificar-usuario">
                    <div className="campo">
                        <label>ID del empleado:</label>
                        <input
                            type="text"
                            name="idEmpleado"
                            value={usuario.idEmpleado}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="campo">
                        <label>Nombre completo:</label>
                        <input
                            type="text"
                            name="nombre"
                            value={usuario.nombre}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="campo">
                        <label>Nueva contraseña:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nueva contraseña"
                        />
                    </div>

                    <div className="campo">
                        <label>Confirmar contraseña:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirmar contraseña"
                            className={
                                confirmPassword && password !== confirmPassword
                                    ? 'input-error'
                                    : ''
                            }
                        />
                        {confirmPassword && password !== confirmPassword && (
                            <span className="error-text">
                                Las contraseñas no coinciden.
                            </span>
                        )}
                    </div>

                    <button className="btn-guardar" onClick={handleGuardar}>
                        Guardar cambios
                    </button>
                </div>
            )}
        </div>
    );
};

export default ModificarUsuarios;
