import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Typography, Button, Link, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import AuthLayout from '../Layouts/AuthLayout';

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
      console.log({ token });

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
      <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{ mt: 2, px: 2 }}
      >
        <Typography
          variant="h3"
          color="#1a1713"
          sx={{ fontFamily: 'Roboto', textAlign: 'center', mb: 4 }}
        >
          Login
        </Typography>

        <Box
          component="form"
          sx={{
            width: '100%',
            maxWidth: 400,
            display: 'flex',
            flexDirection: 'column',
            gap: 2, // Add spacing between elements
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
            fullWidth
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
            fullWidth
          />

          {/* Forget Password Link */}
          <Box
            display="flex"
            justifyContent="flex-end"
            sx={{ mt: -1 }}
          >
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/forget-password')}
            >
              Forget Password?
            </Link>
          </Box>

          {/* Error Message Display */}
          {errorMessage && (
            <Typography color="error" sx={{ mt: 1 }}>
              {errorMessage}
            </Typography>
          )}

          {/* Login Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>

          {/* Register Link */}
          <Box
            display="flex"
            justifyContent="center"
            sx={{ mt: 2 }}
          >
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/register')}
            >
              Register here!
            </Link>
          </Box>
        </Box>
      </Box>

      {/* Toast Container */}
      <ToastContainer />
      </>
     
  );
}
