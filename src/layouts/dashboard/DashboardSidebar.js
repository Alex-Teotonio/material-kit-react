import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { AppBar as MuiAppBar, Box, IconButton, Drawer as MuiDrawer,Stack, Toolbar } from '@mui/material';
import {ChevronLeft, Menu} from '@mui/icons-material';

// mock
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
//
import navConfig from './NavConfig';
import AccountPopover from './AccountPopover';
import LanguagePopover from './LanguagePopover';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;


const openedMixin = (theme) => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: DRAWER_WIDTH,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);


const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  backgroundColor: theme.palette.primary.main,
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: DRAWER_WIDTH,
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));
// ----------------------------------------------------------------------

export default function DashboardSidebar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >

    <Box sx={{ flexGrow: 0.15 }} />
      <NavSection navConfig={navConfig} open={open} />
    </Scrollbar>
  );

  return (
    <RootStyle>
      <AppBar position="fixed" open={open}>

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' })
            }}
          >
            <Menu />
          </IconButton>
        </Toolbar>
        <Stack direction='row' alignItems="center" spacing={2}>
          <LanguagePopover/>
          <AccountPopover/>
        </Stack>
      </Stack>
      </AppBar>
      {!isDesktop && (
        <Drawer
          variant='permanent'
          open={open}
        >
          <DrawerHeader>
            {/* <IconButton sx={{color: '#FFF'}}onClick={handleDrawerClose}>
              <ChevronLeft  />
            </IconButton> */}
          </DrawerHeader>
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open={open}
          variant="permanent"
        >
          <DrawerHeader>
            {/* <IconButton sx={{color: '#FFF'}} onClick={handleDrawerClose}>
              <ChevronLeft />
            </IconButton> */}
          </DrawerHeader>
          {renderContent}
        </Drawer>
      )}
      </RootStyle>
  );
}
