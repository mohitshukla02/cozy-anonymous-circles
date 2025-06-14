
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Landing from './Landing';

const Index = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    );
  }
  
  // If user is logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Otherwise show landing page
  return <Landing />;
};

export default Index;
