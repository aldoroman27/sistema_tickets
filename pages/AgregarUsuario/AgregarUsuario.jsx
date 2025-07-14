import { useState } from 'react';
import axios from 'axios';
import './AgregarUsuario.css';

export const AgregarUsuario = () => {
  const [id, setId] = useState('');
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [admin, setAdmin] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/registro', {
        id,
        usuario,
        contrasena,
        admin,
      });

      setMensaje(response.data.message || '✅ Usuario registrado correctamente');
      setId('');
      setUsuario('');
      setContrasena('');
      setAdmin(false);
    } catch (error) {
      console.error(error);
      setMensaje('❌ Ocurrió un error al registrar el usuario.');
    }
  };

  return (
    <div className="registro-container">
      <h2>Registrar Nuevo Usuario</h2>
      <form className="registro-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="ID del usuario"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={admin}
            onChange={(e) => setAdmin(e.target.checked)}
          />
          Es administrador
        </label>
        <button type="submit">Registrar</button>
      </form>
      {mensaje && <div className="mensaje">{mensaje}</div>}
    </div>
  );
};

export default AgregarUsuario;
