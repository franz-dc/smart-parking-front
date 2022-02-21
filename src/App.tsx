import { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import { SnackbarProvider } from 'notistack';
import { LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDateFns';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { UserContext } from 'contexts';

// components
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
  const [user, setUser] = useState<User | null>(null);

  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    setUser(user);
  });

  return (
    <ThemeProvider theme={theme}>
      <UserContext.Provider value={user}>
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
                    {/* Auth */}
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />

                    {/* User */}
                    <Route path='/' element={<Home />} />
                    <Route path='/availability' element={<Availability />} />
                    <Route path='/reserve' element={<Reserve />} />
                    <Route path='/reservations' element={<Reservations />} />
                    <Route
                      path='/account-settings'
                      element={<AccountSettings />}
                    />

                    {/* Admin */}
                    <Route
                      path='/admin/dashboard'
                      element={<AdminDashboard />}
                    />

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
      </UserContext.Provider>
    </ThemeProvider>
  );
};

export default App;
