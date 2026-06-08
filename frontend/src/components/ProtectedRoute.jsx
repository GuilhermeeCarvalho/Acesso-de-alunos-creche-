import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext.jsx';

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, usuario } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiredRole && usuario?.role !== requiredRole) {
    return <Navigate to="/home" replace />;
  }

  return children;
}