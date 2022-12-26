// component
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFutbol, faBan} from '@fortawesome/free-solid-svg-icons';
import {CalendarMonth} from '@mui/icons-material'
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'Teams',
    path: '/dashboard/teams',
    icon: <FontAwesomeIcon icon={faFutbol} size="lg"/>
  },

  {
    title: 'slots',
    path: '/dashboard/slots',
    icon: <FontAwesomeIcon icon={faFutbol} size="lg"/>
  },

  {
    title: 'Restrictions',
    path: '/dashboard/restrictions',
    icon: <FontAwesomeIcon icon={faBan} size="lg"/>
  },

  {
    title: 'Results',
    path: '/dashboard/result',
    icon: <FontAwesomeIcon icon={<CalendarMonth/>} size="lg"/>
  },

  // {
  //   title: 'user',
  //   path: '/dashboard/user',
  //   icon: getIcon('eva:people-fill'),
  // },
  // {
  //   title: 'product',
  //   path: '/dashboard/products',
  //   icon: getIcon('eva:shopping-bag-fill'),
  // },
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: getIcon('eva:file-text-fill'),
  // },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: getIcon('eva:lock-fill'),
  // },
  // {
  //   title: 'register',
  //   path: '/register',
  //   icon: getIcon('eva:person-add-fill'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: getIcon('eva:alert-triangle-fill'),
  // },
];

export default navConfig;
