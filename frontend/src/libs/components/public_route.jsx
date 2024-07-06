import { Navigate } from 'react-router-dom';
import { Route } from '../../../../shared/constants/route';
import { tokenStorage } from '../storage';

const PublicRoute = ({ children, redirectPath = Route.PROJECTS }) => {
  const token = tokenStorage.get();

  if (token) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export { PublicRoute };
