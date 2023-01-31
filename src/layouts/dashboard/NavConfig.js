// component
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {CalendarMonth,Groups2TwoTone,BlockTwoTone,  DashboardTwoTone,CalendarMonthTwoTone,Schedule} from '@mui/icons-material';

// ----------------------------------------------------------------------

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: <DashboardTwoTone/>
  },
  {
    title: 'Teams',
    path: '/dashboard/teams',
    icon: <Groups2TwoTone/>
  },

  {
    title: 'slots',
    path: '/dashboard/slots',
    icon: <Schedule/>
  },

  {
    title: 'Restrictions',
    path: '/dashboard/restrictions',
    icon: <BlockTwoTone/>
  },

  // {
  //   title: 'Results',
  //   path: '/dashboard/result',
  //   icon: <CalendarMonthTwoTone/>
  // },

  {
    title: 'Results',
    path: '/dashboard/listSolutions',
    icon: <CalendarMonthTwoTone/>
  },
];

export default navConfig;
