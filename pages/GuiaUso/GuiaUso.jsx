import './GuiaUso.css';

//Creamos la función que nos ayudará con el manejo del botón para poder descargar la guía para los usuarios
export const GuiaUso = () => {
  const handleDescargar = () => {
    const link = document.createElement('a');
    link.href = '/guia_uso.pdf'; //El pdf se encuentra en la carpeta PUBLIC
    link.download = 'Guia_de_Uso_Sistema_TI.pdf';//De descargará con este nombre
    link.click();
  };

  return (
    <div className='guiaUso-container'>
      <h1>📘 Guía de uso de la aplicación</h1>
      <p className="guia-texto">
        Aquí podrás descargar la guía paso a paso sobre cómo usar el sistema de tickets.
      </p>
      <button className='btn-descargar' onClick={handleDescargar}>
        📥 Descargar la Guía en PDF
      </button>
    </div>
  );
};

export default GuiaUso;
