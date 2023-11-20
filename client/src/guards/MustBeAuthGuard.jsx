import { useContext } from "react";
import { UserContext } from "../contexts/AuthContext";
import { Navigate, Outlet } from "react-router";

export const MustBeAuthGuard = ({ children }) => {
  const { isAuthenticated } = useContext(UserContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children ? children : <Outlet />;
};