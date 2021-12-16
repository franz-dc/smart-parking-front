import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import { SnackbarProvider } from 'notistack';
import { LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDateFns';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// components
import { Reserve } from 'pages';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HelmetProvider>
        <Helmet
          titleTemplate='%s - Smart Parking System'
          defaultTitle='Smart Parking System'
        />
        <SnackbarProvider>
          <LocalizationProvider dateAdapter={DateAdapter}>
            <BrowserRouter>
              <Routes>
                <Route path='/reserve' element={<Reserve />} />
              </Routes>
            </BrowserRouter>
          </LocalizationProvider>
        </SnackbarProvider>
      </HelmetProvider>
    </ThemeProvider>
  );
};

export default App;
