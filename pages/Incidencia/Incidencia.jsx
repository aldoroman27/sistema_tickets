import axios from "axios";
import { useState, useEffect } from "react";
import './Incidencia.css'

export const Incidencia = () => {
  const [showInstrucciones, setShowInstrucciones] = useState(false);
  const [showEspecificaciones, setShowEspecificaciones] = useState(false);
  const registrarIncidencia_send = 'https://localhost:5000/registrarIncidencia'
  const [incidenciaData, setIncidenciaData] = useState({
    idEmpleado: '',
    nombreCompleto: '',
    puesto: '', 
    correoElectronico: '', 
    departamento:'',
    justificacion: '',
    fecha: '',
    tipoIncidencia : '',
    estado: 'En revisión'
  });

  const[mensajeExito, setMensajeExito] = useState('');
  const[errores, setErrores] = useState([]);

  const handleSubmit =  async (e) => {
    e.preventDefautl();
    setErrores([]);
    setMensajeExito('');
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      const token = usuario?.token;
      const idEmpleado = usuario?.idEmpleado || usuario?.id;

      const incidenciaPayload = {
        ...incidenciaData,
        idEmpleado
      };
      console.log("Información que se enviará: ", incidenciaData)

      const response = await axios.post(
        registrarIncidencia_send,
        incidenciaPayload,
        {
          headers:{
            Authorization: `Bearer ${token}`,
            'Content-Type' : 'application/json'
          }
        }
      );
      setMensajeExito('✅ Incidencia enviada correctamente');
      setIncidenciaData(prev => ({
        idEmpleado: prev.idEmpleado,
        nombreCompleto: '',
        puesto: '', 
        correoElectronico: '', 
        departamento:'',
        justificacion: '',
        fecha: '',
        tipoIncidencia : '',
        estado: 'En revisión'
      }));
      setTimeout(() => {
        setMensajeExito('');
      },4000);
    }catch(error){
      if(error.response && error.response.status == 400) {
        const data = error.response.data;
      if (Array.isArray(data.errores)){
        setErrores(data.errores);
      }else{
        setErrores(['Error de validación']);
      }
    }else {
      setErrores(['Error al conectar con el servidor']);
    }
  };
  };

  useEffect(() =>{
    const usuario =  JSON.parse(localStorage.getItem('usuario'));
    if(usuario){
      const idEmpleado = usuario?.idEmpleado || usuario?.id;
      setIncidenciaData(prev => ({
        ...prev,
        idEmpleado
      }));
    }
  },[]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIncidenciaData(prev => ({ ...prev, [name]: value }));
  };
  return (
    <div className="incidencia-container">
    <h1 className="titulo-incidencia">Registrar incidencia</h1>

    {/* Acordeón - Instrucciones */}
      <div className="acordeon">
        <button
          className="acordeon-header"
          onClick={() => setShowInstrucciones(!showInstrucciones)}
        >
          📋 ¿Cómo llenar el formato?
          <span>{showInstrucciones ? "▲" : "▼"}</span>
        </button>
        {showInstrucciones && (
          <div className="acordeon-body">
            <ol>
              <li>Antes de llenar el formato hablar con RH y con tu respectivo jefe directo</li>
              <li>Completar los datos que se solicitan.</li>
              <li>Seleccionar el tipo de incidencia.</li>
              <li>Justificar la incidencia según los criterios:</li>
              <ul>
                <li>¿Qué sucedió?</li>
                <li>¿Cuánto tiempo tomó? / ¿Afecta entrada o salida?</li>
                <li>¿Cómo se va a proceder? (Ej. PSG, VACACIONES, TxT, etc.)</li>
              </ul>
            </ol>
          </div>
        )}
      </div>

      {/* Acordeón - Especificaciones */}
      <div className="acordeon">
        <button
          className="acordeon-header"
          onClick={() => setShowEspecificaciones(!showEspecificaciones)}
        >
          ⚠️ Especificaciones
          <span>{showEspecificaciones ? "▲" : "▼"}</span>
        </button>
        {showEspecificaciones && (
          <div className="acordeon-body">
            <p>✔ Horas extras deben estar autorizadas por Dirección.</p>
            <p>✔ Vacaciones deben estar firmadas por RH y Dirección.</p>
            <p className="nota">
              Nota: Es tu responsabilidad enviar el formato al momento del evento.
            </p>
          </div>
        )}
      </div>


    <div className="incidencia-formulario-container">
      <form onSubmit={handleSubmit}>
        <label>Nombre Completo:</label>
        <input
          type="text"
          name="nombreCompleto"
          placeholder="Se autoriza a (Nombre del solicitante)"
          value={incidenciaData.nombreCompleto}
          onChange={handleChange}
          required
        />

        <label>Fecha:</label>
        <input
          type="date"
          name="fecha"
          min="2025-05-19"
          max="2035-05-19"
          onChange={handleChange}
          value={incidenciaData.fecha}
          required
        />

        <label>ID de empleado:</label>
        <input
          type="text"
          name="idEmpleado"
          placeholder="ID de Empleado"
          value={incidenciaData.idEmpleado}
          onChange={handleChange}
          readOnly
        />

        <label>Departamento</label>
        <select
          name="departamento"
          value={incidenciaData.departamento}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona un departamento</option>
          {[
            "Contabilidad", "Recursos Humanos", "Compras", "Ventas", "Sistemas",
            "Calidad", "Maquinados", "Diseño Mecánico", "Automatización y control",
            "Proyectos"
          ].map(dep => (
            <option key={dep} value={dep}>{dep}</option>
          ))}
        </select>

        <label>Puesto:</label>
        <input
          type="text"
          name="puesto"
          placeholder="Puesto"
          value={incidenciaData.puesto}
          onChange={handleChange}
          required
        />

        <label>Tipo de incidencia:</label>
        <select
          name="tipoIncidencia"
          value={incidenciaData.tipoIncidencia}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona un tipo de incidencia</option>
          {[
            "Omisión de entrada", "Omisión de salida", "Permiso sin goce",
            "Permiso con goce", "Falta", "Vacaciones", "Incapacidad",
            "Suspensión", "Comisión o curso", "Cambio de horario",
            "Tiempo extra", "Tiempo por tiempo", "Otro (especificar)"
          ].map(tipo => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>

        <label>Justificación de la incidencia:</label>
        <textarea
          name="justificacion"
          placeholder="Ej. (Solicito salir temprano por la razón..., Solicito tiempo extra...)"
          value={incidenciaData.justificacion}
          onChange={handleChange}
          rows={4}
        />

        <button type="submit" className="btn-enviar">Enviar incidencia</button>
      </form>
    </div>
  </div>
  )
}

export default Incidencia;