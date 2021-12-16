import { createTheme } from '@mui/material';

const defaultTheme = createTheme();

export const theme = createTheme({
  typography: {
    h1: {
      fontSize: defaultTheme.typography.pxToRem(35),
      fontWeight: 500,
    },
    h2: {
      fontSize: defaultTheme.typography.pxToRem(28),
      fontWeight: 500,
    },
    h3: {
      fontSize: defaultTheme.typography.pxToRem(21),
      fontWeight: 500,
    },
    h4: {
      fontSize: defaultTheme.typography.pxToRem(18),
      fontWeight: 500,
    },
    h5: {
      fontSize: defaultTheme.typography.pxToRem(14),
      fontWeight: 500,
    },
    h6: {
      fontSize: defaultTheme.typography.pxToRem(12),
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: defaultTheme.typography.pxToRem(14),
    },
    subtitle2: {
      fontSize: defaultTheme.typography.pxToRem(12),
    },
    body1: {
      fontSize: defaultTheme.typography.pxToRem(14),
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        color: 'primary',
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: 'smooth',
          scrollPaddingTop: '80px',
          [defaultTheme.breakpoints.up('sm')]: {
            scrollPaddingTop: '88px',
          },
        },
      },
    },
    MuiFormControl: {
      defaultProps: {
        margin: 'normal',
      },
      styleOverrides: {
        marginDense: {
          marginTop: 0,
          marginBottom: '0.5rem',
        },
        marginNormal: {
          marginTop: 0,
          marginBottom: '1rem',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
    },
  },
});
