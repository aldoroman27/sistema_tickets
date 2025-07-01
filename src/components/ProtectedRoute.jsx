import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario) {
    return <Navigate to="/" replace/>;
  }

  return children;
};
