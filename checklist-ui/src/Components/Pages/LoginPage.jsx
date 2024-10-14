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
import axios from 'axios';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

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
      const token = response.data.access; // Assuming JWT token is in 'access'
      console.log('Login successful:', token);

      // Save token to localStorage
      localStorage.setItem('token', token);
      console.log({token});

      // Show success toast
      toast.success('Login successful!', {
        position: 'top-center',
        autoClose: 2000, // Auto close after 2 seconds
      });

      // Navigate to another page (e.g., dashboard) after successful login
      setTimeout(() => {
        navigate('/');
      }, 2000); // Delay navigation for toast to show
    } catch (error) {
      // Handle error and display a message
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.error); // Display backend error message

        // Show error toast
        toast.error(error.response.data.error, {
          position: 'top-center',
          autoClose: 3000, // Auto close after 3 seconds
        });
      } else {
        setErrorMessage('Login failed. Please try again.');

        // Show generic error toast
        toast.error('Login failed. Please try again.', {
          position: 'top-center',
          autoClose: 3000,
        });
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
            bgcolor: '#EFEFEF', // Changed background color to light beige
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
                color="primary"
                id="email"
                label="Email"
                placeholder="abc@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ width: '100%', minWidth: '250px' }}
              />

              {/* Password Input */}
              <TextField
                required
                color="primary"
                id="password"
                label="Password"
                type="password"
                placeholder="****"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ width: '100%', minWidth: '250px' }}
              />

              {/* Forget Password Link */}
              <Link
                component="button"
                variant="body3"
                onClick={() => {
                  navigate('/forget-password');
                }}
                sx={{ mt: -5, textAlign: 'left', alignSelf: 'flex-end' }}
              >
                Forget Password?
              </Link>

              {/* Error Message Display */}
              {errorMessage && (
                <Typography color="error" sx={{ mt: -5 }}>
                  {errorMessage}
                </Typography>
              )}

              {/* Login Button */}
              <Button variant="contained" color="primary" onClick={handleLogin}>
                Login
              </Button>

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

      {/* Toast Container */}
      <ToastContainer />
    </React.Fragment>
  );
}
