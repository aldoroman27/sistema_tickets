import './GuiaUso.css';
import { BookOpen, FileArrowDown } from 'phosphor-react'
//Creamos la función que nos ayudará con el manejo del botón para poder descargar la guía para los usuarios
export const GuiaUso = () => {
  const handleDescargar = () => {
    const link = document.createElement('a');
    link.href = '/Guia_de_uso_v0.0.14.pdf'; //El pdf se encuentra en la carpeta PUBLIC
    link.download = 'Guia_de_uso_STbyAGRDM.pdf';//Se descargará con este nombre
    link.click();
  };

  return (
    <div className='guiaUso-container'>
      <h1>
        <BookOpen size={32} color='blue' /> Guía de uso de la aplicación
      </h1>
      <p className="guia-texto">
        Aquí podrás descargar la guía paso a paso sobre cómo usar el sistema de tickets.
      </p>
      <button className='btn-descargar' onClick={handleDescargar}>
        <FileArrowDown size={25}/> Descargar Guía de Uso
      </button>
    </div>
  );
};

export default GuiaUso;
