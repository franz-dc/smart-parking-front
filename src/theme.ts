import { createTheme } from '@mui/material';

const defaultTheme = createTheme();

export const theme = createTheme({
  // palette: {
  //   mode: 'dark',
  // },
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
  palette: {
    background: {
      default: '#fafafa',
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: 'contained',
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
        fullWidth: true,
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
