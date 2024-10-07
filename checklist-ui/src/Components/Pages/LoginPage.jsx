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


export default function Forget() {
  const navigate = useNavigate();
  return (
    <React.Fragment>
      <CssBaseline />
      <Typography variant="h3" color = "#1a1713" sx={{ fontFamily: 'Roboto', textAlign: 'center', mb: 2 }}>
        Login
      </Typography>
      <Container maxWidth="sm">
      <Box
          sx={{
            bgcolor: '#F6E6CB',
            padding: 4, // Added padding for better spacing
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
        <Box
        component={Paper}
          sx={{
            height: '60vh',
            width:'250\vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: 3,
            borderRadius: 2,
             // Padding for better spacing inside the box
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column', // Align TextFields vertically
              gap: 6, // Adds space between the TextFields
              alignItems: 'center', // Center items horizontally within this box
              p: 3,
            }}
          >

            <TextField
              required
              color="#A0937D"
              id="outlined-required"
              label="Email"
              placeholder="abc@gmail.com"
              sx={{ width: '120%', minWidth: '250px' }}
            />

            <TextField
              required
              color="#A0937D"
              id="outlined-required"
              label="Password"
              type="password" // Password field
              placeholder='****'
              sx={{ width: '120%', minWidth: '250px' }}
            />

            <Link
                component="button"
                variant="body3"
                onClick={() => {
                  navigate('/forgetpass'); // Navigate to the forget page
                }}
                sx={{ mt:-5, textAlign: 'left' , alignSelf: 'flex-end'}}
                >
                Forget Password?
            </Link>

            <Button variant="outlined" color="#A0937D">Login</Button>

            <Link
                component="button"
                variant="body2"
                onClick={() => {
                  navigate('/Register'); // Navigate to the Register page
                }}
                sx={{ mt:-5 }}
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
