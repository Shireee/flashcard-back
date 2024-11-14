import { ThemeOptions } from '@mui/material';

export const themeOptions: ThemeOptions = {
  components: {
    MuiLinearProgress: {
      styleOverrides: {
        dashed: {
          display: 'none'
        }
      }
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  }
};
