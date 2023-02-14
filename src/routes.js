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
import ChangeCa3 from './pages/ChangeCa3';
import ChangeCa4 from './pages/ChangeCa4';
import ChangeBr1 from './pages/ChangeBr1';
import ChangeBr2 from './pages/ChangeBr2';
import ChangeFa2 from './pages/ChangeFa2';
import ChangeSe1 from './pages/ChangeSe1';
import Ca2 from './pages/Ca2';
import Ca3 from './pages/Ca3';
import Ca4 from './pages/Ca4';
import Br1 from './pages/Br1';
import Br2 from './pages/Br2';
import Fa2 from './pages/Fa2';
import Se1 from './pages/Se1';
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
        { path: 'ca3/:id', element: <ChangeCa3/>},
        { path: 'ca4/:id', element: <ChangeCa4/>},
        { path: 'br1/:id', element: <ChangeBr1/>},
        { path: 'br2/:id', element: <ChangeBr2/>},
        { path: 'fa2/:id', element: <ChangeFa2/>},
        { path: 'se1/:id', element: <ChangeSe1/>},
        { path: 'ca1', element: <Ca1/>},
        { path: 'ca2', element: <Ca2/>},
        { path: 'ca3', element: <Ca3/>},
        { path: 'ca4', element: <Ca4/>},
        { path: 'br1', element: <Br1/>},
        { path: 'br2', element: <Br2/>},
        { path: 'fa2', element: <Fa2/>},
        { path: 'se1', element: <Se1/>},
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
