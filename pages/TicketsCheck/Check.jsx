import './Check.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

  export const CheckTickets = () => {
  const navigate = useNavigate();
  const [nombreUsuario, setNombreUsuario] = useState('');

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      try {
        const usuario = JSON.parse(usuarioGuardado);
        const primerNombre = usuario.nombre?.split(' ')[0] || '';
        setNombreUsuario(primerNombre);
      } catch (e) {
        console.error('Usuario en localStorage no es válido:', e);
      }
    }
  }, []);

  const handlerlogOut = () => {
      localStorage.removeItem('usuario');
      navigate('/');
  };
  
  return (
    <div className='admin-container'>
      <h2 className="titulo-admin">Panel de Administrador{nombreUsuario && ` - Bienvenido, ${nombreUsuario}`}</h2>
      <div className="botones-admin">
        <button className="btn btn-admin" onClick={() => navigate('/ConsultarTicket')}>
          Consultar tickets pendientes
        </button>
        <button className="btn btn-liberar" onClick={() => navigate('/LiberarTicket')}>
           Marcar tickets como completados
        </button>
        <button className="btn btn-eliminar" onClick={() => navigate('/EliminarTicket')}>
          Eliminar tickets
        </button>
        <button className="btn btn-modificar" onClick={() => navigate('/ModificarTicket')}>
          Modificar ticket
        </button>
        <button className="btn btn-buscar" onClick={() => navigate('/BuscarTicket')}>
          Buscar Ticket
        </button>
        <button className="btn btn-resueltos" onClick={() => navigate('/Resueltos')}>
          Tickets Resueltos
        </button>
        <button className="btn btn-mostrarTodos" onClick={() => navigate('/Todo')}>
          Mostrar todos los tickets
        </button>
        <button className='btn btn-cerrarSesion' onClick={handlerlogOut}>
          Cerrar Sesión
        </button>
        <button className='btn btn-AgregarUsuario' onClick={() => navigate('/AgregarUsuario')}>
          Agregar Usuario
        </button>
      </div>
    </div>
  );
};

export default CheckTickets;
