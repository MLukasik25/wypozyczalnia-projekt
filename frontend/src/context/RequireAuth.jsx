import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const RequireAuth = ({ role, children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.rola !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireAuth;
