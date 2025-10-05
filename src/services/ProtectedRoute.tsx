// src/services/ProtectedRoute.tsx
import React from "react";
import { Route, Redirect } from "react-router-dom";

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  requiredRole?: string; // optional
  [key: string]: any;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  requiredRole,
  ...rest
}) => {
  const userRole = localStorage.getItem("userRole");
  const isAuthenticated = !!localStorage.getItem("token"); // or use your login token key

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isAuthenticated) {
          // Not logged in
          return <Redirect to="/login" />;
        }

        if (requiredRole && userRole !== requiredRole) {
          // Logged in but wrong role
          return <Redirect to="/login" />;
        }

        // Authorized
        return <Component {...props} />;
      }}
    />
  );
};

export default ProtectedRoute;
