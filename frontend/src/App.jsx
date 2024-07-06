import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignUp from './pages/auth/components/sign_up';
import LogIn from './pages/auth/components/log_in';
import './app.css';
import ErrorPage from './pages/error/error';
import { Route } from '../../shared/constants/route';
import Projects from './pages/projects/projects';
import { PublicRoute } from './libs/components/public_route';
import { ProtectedRoute } from './libs/components/protected_route';
import { Notification } from './libs/components/notification';
import { Editor } from './pages/editor/editor';

const router = createBrowserRouter([
  {
    path: Route.ROOT,
    element: (
      <PublicRoute>
        <LogIn />
      </PublicRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: Route.LOG_IN,
    element: (
      <PublicRoute>
        <LogIn />
      </PublicRoute>
    ),
  },
  {
    path: Route.SIGN_UP,
    element: (
      <PublicRoute>
        <SignUp />
      </PublicRoute>
    ),
  },
  {
    path: Route.EDITOR,
    element: (
      <ProtectedRoute>
        <Editor />
      </ProtectedRoute>
    ),
  },
  {
    path: Route.EDITOR_$ID,
    element: (
      <ProtectedRoute>
        <Editor />
      </ProtectedRoute>
    ),
  },
  {
    path: Route.PROJECTS,
    element: (
      <ProtectedRoute>
        <Projects />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Notification />
    </>
  );
}

export default App;
