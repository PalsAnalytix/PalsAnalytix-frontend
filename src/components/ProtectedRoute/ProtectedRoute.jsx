// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  if (adminOnly && user.email !== import.meta.env.VITE_ADMIN_EMAIL) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;