import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Blog from './pages/Blog';
import User from './pages/User';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import Products from './pages/Products';
import DashboardApp from './pages/DashboardApp';
import Teams from './pages/Teams';
import Slots from './pages/Slots';
import Restrictions from './pages/Restrictions';
import Ca1 from './pages/Ca1';
import ChangeCa1 from './pages/ChangeCa1';
import ChangeCa2 from './pages/ChangeCa2';
import Ca2 from './pages/Ca2';
import Ca3 from './pages/Ca3';
import Ca4 from './pages/Ca4';
import ResultsLeague from './pages/ResultsLeague';
import DashboardSolutions from './pages/DashboardSolution';

// ---------------------------------s-------------------------------------

export default function Router() {
  return useRoutes([

    {
      path: 'login',
      element: <Login />,
    },
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'teams', element: <Teams/>},
        { path: 'slots', element: <Slots/>},
        { path: 'restrictions', element: <Restrictions/>},
        { path: 'ca1/:id', element: <ChangeCa1/>},
        { path: 'ca2/:id', element: <ChangeCa2/>},
        { path: 'ca1', element: <Ca1/>},
        { path: 'ca2', element: <Ca2/>},
        { path: 'ca3', element: <Ca3/>},
        { path: 'ca4', element: <Ca4/>},
        { path: 'result', element: <ResultsLeague/>},
        { path: 'listSolutions', element: <DashboardSolutions/>},
        { path: 'products', element: <Products /> },
        { path: 'blog', element: <Blog /> },
      ],
    },
    {
      path: 'register',
      element: <Register />,
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/login" /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
