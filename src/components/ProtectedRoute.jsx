import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, onlyAdmin = false }) => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario) {
    return <Navigate to="/" replace/>;
  }

  if(onlyAdmin && !usuario.admin){
    return <Navigate to="/Home" />;
  }

  return children;
};
