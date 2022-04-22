import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import { SnackbarProvider } from 'notistack';
import { LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDateFns';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { UserContextProvider } from '~/contexts';
import { ProtectedUserRoute, ProtectedAdminRoute } from '~/components';

// pages
import {
  // Auth
  Login,
  Register,
  // User
  Home,
  Availability,
  NotFound,
  Reserve,
  Reservations,
  AccountSettings,
  TopUp,
  // Admin
  AdminDashboard,
  UserTopUps,
  ReservationManagement,
  // Dev - commented out for production
  // Seed,
} from '~/pages';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {/* @ts-ignore */}
    <HelmetProvider>
      {/* @ts-ignore */}
      <QueryClientProvider client={queryClient}>
        <Helmet
          titleTemplate='%s - Smart Parking System'
          defaultTitle='Smart Parking System'
        />
        <SnackbarProvider>
          {/* @ts-ignore */}
          <LocalizationProvider dateAdapter={DateAdapter}>
            <UserContextProvider>
              <BrowserRouter>
                <Routes>
                  {/* Home */}
                  <Route path='/' element={<Home />} />

                  {/* Auth */}
                  <Route path='/login' element={<Login />} />
                  <Route path='/register' element={<Register />} />

                  {/* User */}
                  <Route element={<ProtectedUserRoute />}>
                    <Route path='/availability' element={<Availability />} />
                    <Route path='/reserve' element={<Reserve />} />
                    <Route path='/reservations' element={<Reservations />} />
                    <Route
                      path='/account-settings'
                      element={<AccountSettings />}
                    />
                    <Route path='/top-up' element={<TopUp />} />
                  </Route>

                  {/* Admin */}
                  <Route element={<ProtectedAdminRoute />}>
                    <Route
                      path='/admin'
                      element={<Navigate replace to='/admin/dashboard' />}
                    />
                    <Route
                      path='/admin/dashboard'
                      element={<AdminDashboard />}
                    />
                    <Route path='/admin/top-ups' element={<UserTopUps />} />
                    <Route
                      path='/admin/reservations'
                      element={<ReservationManagement />}
                    />

                    {/* Dev */}
                    {/* <Route path='/dev/seed' element={<Seed />} /> */}

                    {/* Admin misc */}
                    <Route path='*' element={<NotFound link='/admin' />} />
                  </Route>

                  {/* Misc */}
                  <Route path='*' element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </UserContextProvider>
          </LocalizationProvider>
        </SnackbarProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </HelmetProvider>
  </ThemeProvider>
);

export default App;
