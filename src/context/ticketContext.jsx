import { createContext, useContext, useEffect, useState } from 'react';

const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);

  // Cargar tickets de LocalStorage al inicio
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('tickets')) || [];
    setTickets(stored);
  }, []);

  // Guardar en LocalStorage cuando cambian
  useEffect(() => {
    localStorage.setItem('tickets', JSON.stringify(tickets));
  }, [tickets]);

  // FUNCIONES QUE EXPORTAMOS
  const agregarTicket = (nuevoTicket) => {
    const ultimoID = parseInt(localStorage.getItem('ultimoIDTicket') || '0', 10);
    const nuevoID = ultimoID + 1;
    const nuevo = { ...nuevoTicket, idTicket: nuevoID, id: nuevoTicket.idEmpleado, estado: 'pendiente' };
    //Guardamos el nuevo ID para el próximo registro
    localStorage.setItem('ultimoIDTicket', nuevoID.toString());
    setTickets(prev => [...prev, nuevo]);
    return nuevo; //<- Devolvemos entonces el nuevo ticket
  };

  //Función para eliminar nuestro ticket en base a su ID de ticket
  const eliminarTicket = (idTicket) => {
    setTickets(prev => prev.filter(t => t.idTicket !== Number(idTicket)));
  };
  
  //Función para liberar el ticket en base a su ID de ticket
  const liberarTicket = (id) => {
    setTickets(prev =>
      prev.map(ticket =>
        ticket.idTicket === id ? { ...ticket, estado: 'completado' } : ticket
      )
    );
  };

  //Modificaremos el ticket, en este caso, tomaremos los nuevos datos y los implementaremos.
  const modificarTicket = (id, nuevosDatos) => {
    setTickets(prev =>
      prev.map(ticket =>
        ticket.idTicket === id ? { ...ticket, ...nuevosDatos } : ticket
      )
    );
  };

  return (
    <TicketContext.Provider value={{
      tickets,
      agregarTicket,
      eliminarTicket,
      liberarTicket,
      modificarTicket,
    }}>
      {children}
    </TicketContext.Provider>
  );
};

// HOOK PARA ACCEDER A LOS DATOS
export const useTickets = () => useContext(TicketContext);
