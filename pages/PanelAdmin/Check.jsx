import './Check.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  UserGear, //Para nuestro título de bienvenida
  ListChecks, // ícono para consultar tickets
  CheckCircle, // ícono para liberar tickets
  Trash, // ícono para eliminar tickets
  PencilSimple, // ícono para modificar tickets
  MagnifyingGlass, // ícono para buscar tickets
  Archive, // ícono para tickets resueltos
  ListDashes, // ícono para mostrar todos los tickets
  SignOut, // ícono para cerrar sesión
  UserPlus, // ícono para agregar usuario
  Users, // ícono para ver todos los usuarios
  IdentificationCard,
  UserCircleMinus
} from 'phosphor-react';

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
      <h2 className="titulo-admin">
        <UserGear size={32} />Panel de Administrador{nombreUsuario && ` - Bienvenido, ${nombreUsuario}`}
      </h2>
      <div className="botones-admin">
        <button className="btn btn-admin" onClick={() => navigate('/ConsultarTicket')}>
          <ListChecks size={32}/> Consultar tickets pendientes
        </button>
        <button className="btn btn-liberar" onClick={() => navigate('/LiberarTicket')}>
           <CheckCircle size={32}/> Marcar tickets como completados
        </button>
        <button className="btn btn-eliminar" onClick={() => navigate('/EliminarTicket')}>
          <Trash size={32}/>Eliminar tickets
        </button>
        <button className="btn btn-modificar" onClick={() => navigate('/ModificarTicket')}>
          <PencilSimple size={32}/>Modificar ticket
        </button>
        <button className="btn btn-buscar" onClick={() => navigate('/BuscarTicket')}>
          <MagnifyingGlass size={32}/>Buscar Ticket
        </button>
        <button className="btn btn-resueltos" onClick={() => navigate('/Resueltos')}>
          <Archive size={32}/>Tickets Resueltos
        </button>
        <button className="btn btn-mostrarTodos" onClick={() => navigate('/Todo')}>
          <ListDashes size={32}/>Mostrar todos los tickets
        </button>
        <button className='btn btn-cerrarSesion' onClick={handlerlogOut}>
          <SignOut size={32}/>Cerrar Sesión
        </button>
        <button className='btn btn-AgregarUsuario' onClick={() => navigate('/AgregarUsuario')}>
          <UserPlus size={32}/>Agregar Usuario
        </button>
        <button className='btn btn-UsuariosRegistrados' onClick={() => navigate('/UsuariosRegistrados')}>
          <Users size={32}/>Usuarios Registrados
        </button>
        <button className='btn btn-ModificarUsuarios' onClick={() => navigate('/ModificarUsuarios')}>
          <IdentificationCard size={32}/> Modificar Usuarios
        </button>
        <button className='btn btn-EliminarUsuarios' onClick={() => navigate('/EliminarUsuarios')}>
          <UserCircleMinus size={32}/> Eliminar Usuarios
        </button>
      </div>
    </div>
  );
};

export default CheckTickets;
