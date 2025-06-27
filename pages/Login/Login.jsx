import axios from 'axios';
import './Login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [idEmpleado, setIdEmpleado] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idEmpleado || !contrasena) {
      setMensaje('⚠️ Ingresa todos los campos.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/login', {
        id: idEmpleado,
        contrasena: contrasena
      });

      // Guardamos los datos del usuario en localStorage (puedes usar context si prefieres)
      localStorage.setItem('usuario', JSON.stringify(response.data));

      setMensaje('✅ Inicio de sesión exitoso.');
      navigate('/Tickets'); // redirige al panel principal
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        setMensaje('❌ Credenciales incorrectas.');
      } else {
        setMensaje('❌ Error al conectar con el servidor.');
      }
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2 className="login-title">Panel de Inicio de Sesión</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="ID de empleado"
            value={idEmpleado}
            onChange={(e) => setIdEmpleado(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
          <button type="submit">Iniciar Sesión</button>
        </form>
        {mensaje && <p className="mensaje-login">{mensaje}</p>}
      </div>
    </div>
  );
};

export default Login;
