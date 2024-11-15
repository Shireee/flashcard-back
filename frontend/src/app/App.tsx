import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { QueryClientProvider } from 'react-query';
import { store } from '@shared/store';
import { queryClient } from '@shared/api';
import { TrainingSession } from '@pages';
import { createTheme, ThemeProvider } from '@mui/material';
import { themeOptions } from './config';

function App() {
  const theme = createTheme(themeOptions);
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <TrainingSession />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
