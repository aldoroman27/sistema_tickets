import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Home.css';

//Definimos nuestro componente Home
export const Home = () => {
  const navigate = useNavigate();
  const [nombreUsuario, setNombreUsuario] = useState('');

  //Vamos a extraer la información del localstorage que necesitamos, en este caso el primer nombre del usuario
  useEffect(() => {
      const usuarioGuardado = localStorage.getItem('usuario');//Accedemos al localstorage
      if (usuarioGuardado) {//Si es que hay un usuario guardado entonces
        try {//Intenamos el siguiente bloque de instrucciones
          const usuario = JSON.parse(usuarioGuardado);//Asignamos a una varibale el usuario
          const primerNombre = usuario.nombre?.split(' ')[0] || '';//Extraemos el nombre de nuestro objeto hasta el primer espacio.
          setNombreUsuario(primerNombre);//Guardamos entonces el primer nombre de nuestro usuario
        } catch (e) {//En caso de fallar
          console.error('Usuario en localStorage no es válido:', e);//Mostramos error
        }
      }
    }, []);
  
  //Estos son nuestros handlers que nos llevarán a las rutas que necesitemos en los botones.
  const handleGenerarTicket = () => {
    navigate('/Tickets');
  };
  //Nos llevará a nuestra guía de uso
  const handleGuiaUso = () => {
    navigate('/GuiaUso');
  };
  //Cerraremos la sesión
  const handleCerrarSesion = () => {
    localStorage.removeItem('usuario');//Eliminamos el registro de localstorage de nuestro usuario registrado
    navigate('/');//Nos reedirigira a la pestaña principal por defecto, en este caso será nuestro Login
  };
  //Para poder consultar nuestro ticket.
  const handleConsultarticket = () => {
    navigate('/ViewTicket')
  };

  return (
    <div className='home-container'>
      <h1>Bienvenido al sistema de tickets {nombreUsuario && `, ${nombreUsuario} ¿Cómo podemos ayudarte?`}</h1>
      <h2>Seleccione una acción a realizar</h2>

      <div className='buttons-container'>
        <button className='btn generarTicket' onClick={handleGenerarTicket}>
          Generar un Ticket
        </button>
        <button className='btn estadoTicket' onClick={handleConsultarticket}>
            Mis tickets
        </button>
        <button className='btn guiadeUso' onClick={handleGuiaUso}>
          Guía de Uso
        </button>
        <button className='btn cerrarSesion' onClick={handleCerrarSesion}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Home;
