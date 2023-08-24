import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar as MuiAppBar,
  Box,
  MenuItem,
  IconButton,
  Drawer as MuiDrawer,
  Toolbar,
  Card,
  Link,
  Container,
  Paper,
  Stack,
  Typography 
} from '@mui/material';

import { useContext, useRef, useState } from 'react';

import {PersonAdd, Home, Event} from '@mui/icons-material'
// @mui
import { styled, alpha } from '@mui/material/styles';
import { LeagueContext } from '../hooks/useContextLeague';
import MenuPopover from '../components/MenuPopover';
// hooks
// components
import Page from '../components/Page';
import { LANGS } from '../utils/dataComponents';
// sections
import { LoginForm } from '../sections/auth/login';
import AuthSocial from '../sections/auth/AuthSocial';

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
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 764,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 680,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  
  const { currentLanguage, saveCurrentLanguage } = useContext(LeagueContext);
  const handleLanguage = (languageSelected) => {
    setOpen(false)
    saveCurrentLanguage(languageSelected);
  };

  const handleOpen = () => {
    setOpen(true)
  }
  return (
    <Page title="Login">
    <Paper square>
      <RootStyle>

      <MenuPopover
        open={open}
        onClose={handleLanguage}
        anchorEl={anchorRef.current}
        sx={{
          mt: 1.5,
          ml: 0.75,
          width: 180,
          '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 },
        }}
      >
        <Stack spacing={0.75}>
          {LANGS.map((option) => (
            <MenuItem key={option.value} selected={option.value === currentLanguage.value} onClick={() => handleLanguage(option.value)}>
              <Box component="img" alt={option.label} src={option.icon} sx={{ width: 28, mr: 2 }} />

              {option.label}
            </MenuItem>
          ))}
        </Stack>
      </MenuPopover>
      <AppBar position="fixed">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Event sx={{ color: '#FFF', mr: 0.5 }} />
                <Typography variant="h6" noWrap>
                  MatchMate
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <Link component={RouterLink} to="/register" sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonAdd sx={{ mr: 1, color: '#FFF' }} />
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: "#FFF" }}>
                    Create Account
                  </Typography>
                </Link>

                <IconButton
                  ref={anchorRef}
                  onClick={handleOpen}
                  sx={{
                    padding: 0,
                    width: 44,
                    height: 44,
                    ml: 3,
                    ...(open && {
                      bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity),
                    }),
                  }}
                >
                  <img src={currentLanguage.icon} alt={currentLanguage.label} />
                </IconButton>
              </Box>
        </Toolbar>
      </AppBar>


        <SectionStyle>
          <img src="/static/illustrations/timetable-software.png" alt="login" />
        </SectionStyle>
        <Container maxWidth="sm">
          <ContentStyle>

          <Paper elevation={2} square>
          <Typography variant="h2" gutterBottom align='left' sx={{padding: '5px'}}>
            The Perfect solution for sports competitions.
          </Typography>

            <Typography sx={{ color: 'text.secondary', mb:1, padding: '5px' }} align="left">
              Welcome to our web interface for competition programming problems. Our goal is to simplify the complexity of managing sports competitions by providing an intuitive and user-friendly interface. 
            </Typography>

            <Typography sx={{ color: 'text.secondary', mb: 2, padding: '5px'}} align="left">
              Get started by logging in below:
            </Typography>
              <LoginForm />
              <AuthSocial />
            </Paper>
          </ContentStyle>
        </Container>
      </RootStyle>
        </Paper>
    </Page>
  );
}
