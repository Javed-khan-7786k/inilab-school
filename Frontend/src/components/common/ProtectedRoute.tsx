/**
 * ProtectedRoute — Guards routes that require authentication.
 *
 * Why: Prevents unauthenticated users from accessing the dashboard.
 *      Checks sessionStorage for login state and redirects to /login if missing.
 *
 * Props:
 *  - children: the protected page content
 */

import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";
  const userRole = sessionStorage.getItem("userRole");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    // If the user's role is not authorized, redirect them back to the login page (or an unauthorized screen)
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
