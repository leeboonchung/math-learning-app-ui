import { Typography, Box, Button, TextField, Paper } from '@mui/material';

const Login = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Paper elevation={3} sx={{ p: 4, width: 320 }}>
        <Typography variant="h5" gutterBottom>Login (Mock)</Typography>
        <TextField label="Email" fullWidth margin="normal" />
        <TextField label="Password" type="password" fullWidth margin="normal" />
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Login</Button>
      </Paper>
    </Box>
  );
};

export default Login;
