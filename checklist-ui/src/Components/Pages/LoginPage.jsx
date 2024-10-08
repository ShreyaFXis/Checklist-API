import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import axios from 'axios'; // Import Axios
import { useState } from 'react'; // Import useState

export default function LoginPage() {
  const navigate = useNavigate();

  // State for email, password, and error messages
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email: email,
        password: password,
      });
      // Handle successful login (e.g., save tokens, redirect)
      console.log('Login successful:', response.data);
      // Navigate to another page (e.g., dashboard) after successful login
      navigate('/dashboard');
    } catch (error) {
      // Handle error and display a message
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.error); // Display backend error message
      } else {
        setErrorMessage('Login failed. Please try again.');
      }
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Typography
        variant="h3"
        color="#1a1713"
        sx={{ fontFamily: 'Roboto', textAlign: 'center', mb: 2 }}
      >
        Login
      </Typography>
      <Container maxWidth="sm">
        <Box
          sx={{
            bgcolor: '#F6E6CB',
            padding: 4,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Box
            component={Paper}
            sx={{
              height: '60vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: 3,
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                alignItems: 'center',
                p: 3,
              }}
            >
              {/* Email Input */}
              <TextField
                required
                color="#A0937D"
                id="email"
                label="Email"
                placeholder="abc@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ width: '120%', minWidth: '250px' }}
              />

              {/* Password Input */}
              <TextField
                required
                color="#A0937D"
                id="password"
                label="Password"
                type="password"
                placeholder="****"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ width: '120%', minWidth: '250px' }}
              />

              {/* Error Message Display */}
              {errorMessage && (
                <Typography color="error" sx={{ mt: -5 }}>
                  {errorMessage}
                </Typography>
              )}

              {/* Login Button */}
              <Button variant="outlined" color="#A0937D" onClick={handleLogin}>
                Login
              </Button>

              {/* Forget Password Link */}
              <Link
                component="button"
                variant="body3"
                onClick={() => {
                  navigate('/forgetpass');
                }}
                sx={{ mt: -5, textAlign: 'left', alignSelf: 'flex-end' }}
              >
                Forget Password?
              </Link>

              {/* Register Link */}
              <Link
                component="button"
                variant="body2"
                onClick={() => {
                  navigate('/register');
                }}
                sx={{ mt: -5 }}
              >
                Register here!
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </React.Fragment>
  );
}
