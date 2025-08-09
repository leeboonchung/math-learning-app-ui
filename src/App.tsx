
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, Box } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Exercises from './pages/Exercises';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#ff9800' },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: {
    h4: {
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h6: {
      '@media (max-width:600px)': {
        fontSize: '1.1rem',
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ 
          minHeight: '100vh', 
          width: '100%',
          px: { xs: 1, sm: 2, md: 3 },
          py: { xs: 2, sm: 3 }
        }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/exercises" element={<Exercises />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
