import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

// Pages
import Landing from './pages/landing/Landing';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import LaunchesPage from './pages/launches/LaunchesPage';
import LaunchDetailPage from './pages/launches/LaunchDetailPage';
import RocketsPage from './pages/rockets/RocketPage';
import RocketDetailPage from './pages/rockets/RocketsDetailPage';
import CrewPage from './pages/crew/CrewPage';
import ProtectedRoute from './routes/ProtectedRoute';
import CrewDetailPage from './pages/crew/CrewDetailPage';

export const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Landing />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/dashboard',
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>
      },
      // Launch routes
      {
        path: '/launches',
        element: <ProtectedRoute><LaunchesPage /></ProtectedRoute>
      },
      {
        path: '/launches/:launchId',
        element: <ProtectedRoute><LaunchDetailPage /></ProtectedRoute>
      },
      // Rocket routes
      {
        path: '/rockets',
        element: <ProtectedRoute><RocketsPage /></ProtectedRoute>
      },
      {
        path: '/rockets/:rocketId',
        element: <ProtectedRoute><RocketDetailPage /></ProtectedRoute>
      },
      // Crew routes
      {
        path: '/crew',
        element: <ProtectedRoute><CrewPage /></ProtectedRoute>
      },
      {
        path: '/crew/:crewId',
        element: <ProtectedRoute><CrewDetailPage /></ProtectedRoute>
      },
      // Fallback route
      {
        path: '*',
        element: <Navigate to="/" replace />
      }
    ]
  }
];

const router = createBrowserRouter(routes);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      cacheTime: 1000 * 60 * 15
    }
  }
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);