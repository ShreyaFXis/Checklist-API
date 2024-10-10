import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ConfirmForgetPass() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract token and email from the URL query params
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Send request to backend
      const response = await axios.post('http://localhost:8000/api/confirm-forget-password', {
        token,
        email,
        new_password: newPassword,
        confirm_password: confirmPassword
      });

      // Handle success
      if (response.status === 200) {
        toast.success("Password reset successful. Redirecting to login...");
        setTimeout(() => {
          navigate('/login');
        }, 3000); // Redirect to login page after 3 seconds
      }
    } catch (err) {
      setError("An error occurred during password reset");
      toast.error("Password reset failed. Please try again.");
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <ToastContainer />

      <Typography 
        variant="h4" 
        color="#1a1713" 
        sx={{ 
          fontFamily: 'Roboto', 
          textAlign: 'center', 
          mb: 2 
        }}
      >
        Set New Password
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
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: 3,
              borderRadius: 2,
              padding: 3,
            }}
          >
            <form onSubmit={handleSubmit}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                  alignItems: 'center',
                  width: '100%'
                }}
              >
                <input type="hidden" value={token} />
                <input type="hidden" value={email} />

                <TextField
                  required
                  id="new-password"
                  label="New Password"
                  type="password"
                  placeholder="Enter new password"
                  sx={{ width: '100%', minWidth: '250px' }}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (error) setError('');
                  }}
                />

                <TextField
                  required
                  id="confirm-password"
                  label="Confirm Password"
                  type="password"
                  placeholder="Re-enter new password"
                  sx={{ width: '100%', minWidth: '250px' }}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError('');
                  }}
                />

                {error && <Typography color="error">{error}</Typography>}

                <Button type="submit" variant="contained" color="primary">
                  Reset Password
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Container>
    </React.Fragment>
  );
}
