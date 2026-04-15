import { Navigate } from "react-router-dom";

export const AdminRoute = ({ children }) => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario || !usuario.admin) {
    return <Navigate to="/Login" />;
  }

  return children;
};
