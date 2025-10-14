import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  token: string | null;
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ token, children }) => {
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
