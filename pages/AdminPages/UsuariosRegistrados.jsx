import { useEffect, useState } from 'react';
import axios from 'axios';
import './UsuariosRegistrados.css';

export const UsuariosRegistrados = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const url = import.meta.env.VITE_consultar_usuarios;

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get(url);
        setUsuarios(response.data);
        setCargando(false);
      } catch (err) {
        console.error(err);
        setError('Error al cargar los usuarios');
        setCargando(false);
      }
    };

    fetchUsuarios();
  }, []);

  if (cargando) return <p>Cargando usuarios...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="tabla-container">
      <h2>Usuarios Registrados</h2>
      <table className="tabla-usuarios">
        <thead>
          <tr>
            <th>ID Empleado</th>
            <th>Nombre</th>
            <th>Contraseña (Hash)</th>
            <th>Tipo</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario, index) => (
            <tr
              key={index}
              className={usuario.admin ? 'fila-admin' : 'fila-normal'}
            >
              <td>{usuario.idEmpleado}</td>
              <td>{usuario.nombre}</td>
              <td>{usuario.password_hash}</td>
              <td>{usuario.admin ? 'Administrador' : 'Usuario'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsuariosRegistrados;
