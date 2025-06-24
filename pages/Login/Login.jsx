
import './Login.css';

export const Login = () => {
  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2 className="login-title">Panel de Inicio de Sesión</h2>
        <form className="login-form">
          <input type="text" placeholder="ID de empleado" />
          <input type="password" placeholder="Contraseña" />
          <button type="submit">Iniciar Sesión</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
