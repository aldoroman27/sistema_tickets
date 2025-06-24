import { createContext, useContext, useEffect, useState } from 'react';

const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);

  // Cargar desde LocalStorage al iniciar
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('tickets')) || [];
    setTickets(stored);
  }, []);

  // Guardar automáticamente cuando se actualiza
  useEffect(() => {
    localStorage.setItem('tickets', JSON.stringify(tickets));
  }, [tickets]);

  const agregarTicket = (nuevoTicket) => {
    setTickets(prev => [...prev, { ...nuevoTicket, id: Date.now(), estado: 'pendiente' }]);
  };

  const eliminarTicket = (id) => {
    setTickets(prev => prev.filter(ticket => ticket.id !== id));
  };

  const liberarTicket = (id) => {
    setTickets(prev =>
      prev.map(ticket => ticket.id === id ? { ...ticket, estado: 'liberado' } : ticket)
    );
  };

  const modificarTicket = (id, nuevosDatos) => {
    setTickets(prev =>
      prev.map(ticket => ticket.id === id ? { ...ticket, ...nuevosDatos } : ticket)
    );
  };

  return (
    <TicketContext.Provider value={{
      tickets,
      agregarTicket,
      eliminarTicket,
      liberarTicket,
      modificarTicket
    }}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => useContext(TicketContext);
