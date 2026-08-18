import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

interface RoleRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

function RoleRoute({
  children,
  allowedRoles,
}: RoleRouteProps) {
  const { user, token } = useAuth();

  // Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role
  if (!allowedRoles.includes(user.role)) {

    if (user.role === "SERVICE_PROVIDER") {
      return <Navigate to="/mechanic" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default RoleRoute;