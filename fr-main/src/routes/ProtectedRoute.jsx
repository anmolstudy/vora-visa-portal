import { Navigate, useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute
 * @param {string|string[]} role - required role(s) to access this route
 * @param {string} redirectTo - where to send unauthorized users (default "/")
 */
const ProtectedRoute = ({ children, role, redirectTo = "/" }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show a spinner while auth state resolves — never flash protected content
  if (loading) {
    return (
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    // Preserve the intended destination so we can redirect after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  const requiredRoles = Array.isArray(role) ? role : role ? [role] : [];
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;
