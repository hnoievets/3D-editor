import { Navigate } from 'react-router-dom';
import { Route } from '../../../../shared/constants/route';
import { tokenStorage } from '../storage';

const ProtectedRoute = ({ children, redirectPath = Route.LOG_IN }) => {
  // отримання токену зі сховища
  const token = tokenStorage.get();

  // при відсутності токена редірект за переданою адресою 
  if (!token) {
    return <Navigate to={redirectPath} replace />;
  }

  // повернення дочірнього компонента
  return children;
};

export { ProtectedRoute };
