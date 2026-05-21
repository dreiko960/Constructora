import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Login from './app/pages/Login';
import Dashboard from './app/pages/Dashboard';
import Projects from './app/pages/Projects';
import CreateProject from './app/pages/CreateProject';
import ProjectDetail from './app/pages/ProjectDetail';
import Users from './app/pages/Users';
import CreateUser from './app/pages/CreateUser';
import EditUser from './app/pages/EditUser';
import Documents from './app/pages/Documents';
import DocumentDetail from './app/pages/DocumentDetail';
import Evidencias from './app/pages/Evidencias';
import Reports from './app/pages/Reports';
import PlanoDetail from './app/pages/PlanoDetail';
import RootLayout from './app/components/RootLayout';
import NotFound from './app/pages/NotFound';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'usuarios',
        children: [
          {
            index: true,
            element: <Users />,
          },
          {
             path: 'nuevo',
             element: <CreateUser />,
           },
           {
             path: 'editar/:id',
             element: <EditUser />,
           }
        ]
      },
      {
        path: 'documentos',
        children: [
          {
            index: true,
            element: <Documents />,
          },
          {
            path: ':id',
            element: <DocumentDetail />,
          }
        ]
      },
      {
        path: 'evidencias',
        element: <Evidencias />,
      },
      {
        path: 'reportes',
        element: <Reports />,
      },
      {
        path: 'proyectos',
        children: [
          {
            index: true,
            element: <Projects />,
          },
          {
            path: 'nuevo',
            element: <CreateProject />,
          },
          {
            path: ':id',
            element: <ProjectDetail />,
          },
          {
            path: ':id/planos/:planoId',
            element: <PlanoDetail />,
          }
        ]
      },
      // Other routes will be added here
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  }
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
