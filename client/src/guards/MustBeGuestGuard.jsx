import { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { UserContext } from "../contexts/AuthContext";

export const MustBeGuestGuard = ({ children }) => {
  const { isAuthenticated } = useContext(UserContext);

  if (isAuthenticated) {
    return <Navigate to="/feed" />;
  }
  return children ? children : <Outlet />;
};