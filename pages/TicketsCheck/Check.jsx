import './Check.css';
import { useNavigate } from 'react-router-dom';
export const CheckTickets = () => {
  const navigate = useNavigate();
  return (
    <div className='admin-container'>
      <h2 className="titulo-admin">Panel de Administrador</h2>
      <div className="botones-admin">
        <button className="btn-admin" onClick={() => navigate('/ConsultarTicket')}>
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
      </div>
    </div>
  );
};

export default CheckTickets;
