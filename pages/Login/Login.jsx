import axios from 'axios';
import './Login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [idEmpleado, setIdEmpleado] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();
  const login_send = import.meta.env.VITE_login_send;

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Mostramos mensaje en caso que no se introduzca nada o que haga falta algún dato
    if (!idEmpleado || !contrasena) {
      setMensaje('⚠️ Ingresa todos los campos.');
      return;
    }

    //Hacemos la petición a nuestra ruta. Deberá de cambiarse a un archivo .env
    try {
      const response = await axios.post(login_send, {
        id: idEmpleado,
        contrasena: contrasena
      });

      // Guardamos los datos del usuario en localStorage, podmeos usar context si es que se requiere
      localStorage.setItem('usuario', JSON.stringify(response.data));
      setMensaje('✅ Inicio de sesión exitoso.');
      //En caso de que sea administrador, entonces entramos al panel de administrador
      if (response.data.admin) {
        navigate('/CheckTickets');
      //Si es que es modo usuario, entonces mostramos el panel de Home
      } else {
        navigate('/Home');
      }
    } catch (error) {
      console.error(error);
      //Mostramos mensje en caso de error con el respectivo estatus del servidor, en caso de que sean credenciales incorrectas
      if (error.response && error.response.status === 401) {
        setMensaje('❌ Credenciales incorrectas, intente nuevamente.');
      //Mostramos mensjae de error en caso que nuestro servidor no esté conectado
      } else {
        setMensaje('❌ Error al conectar con el servidor.');
      }
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <img src="/mido.png"/>
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
