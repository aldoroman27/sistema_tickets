import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Home.css';

export const Home = () => {
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

  const handleGenerarTicket = () => {
    navigate('/Tickets');
  };

  const handleGuiaUso = () => {
    navigate('/GuiaUso');
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem('usuario');
    navigate('/');
  };

  const handleConsultarticket = () => {
    navigate('/BuscarTicket')
  };

  return (
    <div className='home-container'>
      <h1>Bienvenido al sistema de tickets {nombreUsuario && `, ${nombreUsuario} ¿Cómo podemos ayudarte?`}</h1>
      <h2>Seleccione una acción a realizar</h2>

      <div className='buttons-container'>
        <button className='btn generarTicket' onClick={handleGenerarTicket}>
          Generar un Ticket
        </button>
        <button className='btn guiadeUso' onClick={handleGuiaUso}>
          Guía de Uso
        </button>
        <button className='btn cerrarSesion' onClick={handleCerrarSesion}>
          Cerrar Sesión
        </button>
        <button className='btn estadoTicket' onClick={handleConsultarticket}>
            Consultar Estado de Ticket
        </button>
      </div>
    </div>
  );
};

export default Home;
