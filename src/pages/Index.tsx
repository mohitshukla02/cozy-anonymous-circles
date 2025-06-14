import { useUser } from '../contexts/UserContext';
import { Navigate } from 'react-router-dom';
import Landing from './Landing';

const Index = () => {
  const { user } = useUser();
  
  // If user is logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Otherwise show landing page
  return <Landing />;
};

export default Index;
