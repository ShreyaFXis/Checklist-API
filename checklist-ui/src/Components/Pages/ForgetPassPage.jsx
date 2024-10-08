import * as React from 'react';
import { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import axios from 'axios';

export default function ForgetPassPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send request to backend to send reset link
      const response = await axios.post('http://localhost:8000/api/forget-password', {
        email: email,
      });

      // Handle successful response
      if (response.status === 200) {
        setSuccess("Password reset link sent to your email.");
        setError('');  // Clear any previous errors
      }
    } catch (err) {
      // Handle errors
      setError("An error occurred. Please check your email address.");
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Typography 
        variant="h4" 
        color="#1a1713" 
        sx={{ 
          fontFamily: 'Roboto', 
          textAlign: 'center', 
          mb: 2 
        }}
      >
        Reset Your Password
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
                <TextField
                  required
                  color="primary"
                  id="email"
                  label="Email"
                  placeholder="abc@gmail.com"
                  sx={{ width: '100%', minWidth: '250px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {error && <Typography color="error">{error}</Typography>}
                {success && <Typography color="green">{success}</Typography>}

                <Button variant="contained" type="submit" sx={{ mt: 2 }}>Send Reset Link</Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Container>
    </React.Fragment>
  );
}
