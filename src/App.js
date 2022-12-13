// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
import {LeagueProvider}  from './hooks/useContextLeague';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <LeagueProvider>
      <ThemeProvider>
        <ScrollToTop />
        <BaseOptionChartStyle />
        <Router />
      </ThemeProvider>
    </LeagueProvider>
  );
}
