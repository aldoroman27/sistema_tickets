
import './Login.css';
export const Login = () => {
  return (
    <div className="container-l">
      <h1 className="subtitle">Iniciar Sesión</h1>
            
            <form>
                <input type="text" placeholder="ID de empleado" />
                <input type="password" placeholder="Contraseña" />
                <button className="btn-iniciar">Iniciar Sesion</button>
            </form>
        </div>
  )
}
export default Login;