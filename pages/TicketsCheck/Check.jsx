import './Check.css';

export const CheckTickets = () => {
  return (
    <div className='admin-container'>
      <h2 className="titulo-admin">Panel de Administrador</h2>
      <div className="botones-admin">
        <button className="btn btn-consultar">Consultar tickets pendientes</button>
        <button className="btn btn-liberar">Liberar tickets</button>
        <button className="btn btn-eliminar">Eliminar tickets</button>
        <button className="btn btn-modificar">Modificar ticket</button>
        <button className="btn btn-buscar">Buscar Ticket</button>
        <button className="btn btn-resueltos">Tickets Resueltos</button>
      </div>
    </div>
  );
};

export default CheckTickets;
