import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import { SnackbarProvider } from 'notistack';
import { LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDateFns';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

// components
import {
  Availability,
  NotFound,
  Reserve,
  // Admin
  AdminDashboard,
  // Dev
  Seed,
} from 'pages';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <Helmet
            titleTemplate='%s - Smart Parking System'
            defaultTitle='Smart Parking System'
          />
          <SnackbarProvider>
            <LocalizationProvider dateAdapter={DateAdapter}>
              <BrowserRouter>
                <Routes>
                  <Route path='/availability' element={<Availability />} />
                  <Route path='/reserve' element={<Reserve />} />

                  {/* Admin */}
                  <Route path='/admin/dashboard' element={<AdminDashboard />} />

                  {/* Dev */}
                  <Route path='/dev/seed' element={<Seed />} />

                  {/* Misc */}
                  <Route path='*' element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </LocalizationProvider>
          </SnackbarProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </HelmetProvider>
    </ThemeProvider>
  );
};

export default App;
