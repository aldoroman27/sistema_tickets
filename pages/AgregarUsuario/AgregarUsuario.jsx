import { useState } from 'react';
import axios from 'axios';
import { IdentificationCard, User, Lock, ShieldCheck, CheckCircle } from "phosphor-react";
import './AgregarUsuario.css';

export const AgregarUsuario = () => {
  const [id, setId] = useState('');
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [admin, setAdmin] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const send_registrar = import.meta.env.VITE_registrar_send;

  const contrasenasIguales = contrasena === confirmar && contrasena !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!contrasenasIguales) {
      setMensaje('❌ Las contraseñas no coinciden');
      setTimeout(() => setMensaje(''), 3000);
      return;
    }

    try {
      const response = await axios.post(send_registrar, {
        idEmpleado: id,
        nombre: usuario,
        password: contrasena,
        admin: admin,
      });

      setMensaje(response.data.message || 'Usuario registrado correctamente');
      setTimeout(() => setMensaje(''), 4000);

      setId('');
      setUsuario('');
      setContrasena('');
      setConfirmar('');
      setAdmin(false);

    } catch (error) {
      console.error(error);
      setMensaje('❌ Ocurrió un error al registrar el usuario.');
      setTimeout(() => setMensaje(''), 4000);
    }
  };

  return (
    <div className="registro-container">
      <h2 className="titulo">Registrar Nuevo Usuario</h2>

      <form className="registro-form" onSubmit={handleSubmit}>

        <div className="input-group">
          <IdentificationCard size={22} className="icon" />
          <input
            type="text"
            placeholder="ID del usuario"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>

        <div className="input-group">
          <User size={22} className="icon" />
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
        </div>

        <div className="input-group">
          <Lock size={22} className="icon" />
          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
        </div>

        <div className={`input-group ${confirmar && !contrasenasIguales ? "input-error" : ""}`}>
          <CheckCircle size={22} className="icon" />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
          />
        </div>

        {!contrasenasIguales && confirmar && (
          <p className="error-text">⚠️ Las contraseñas no coinciden</p>
        )}

        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={admin}
            onChange={(e) => setAdmin(e.target.checked)}
          />
          <ShieldCheck size={20} className="checkbox-icon" />
          Es administrador
        </label>

        <button
          type="submit"
          className="btn-registrar"
          disabled={!contrasenasIguales}
        >
          Registrar
        </button>
      </form>

      {mensaje && <div className="mensaje">{mensaje}</div>}
    </div>
  );
};

export default AgregarUsuario;
