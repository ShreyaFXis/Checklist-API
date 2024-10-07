import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { useNavigate } from 'react-router-dom';

const RegistrationPage = () => {
  const [gender, setGender] = React.useState('');
  const navigate = useNavigate();

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ mt: 4 }}> {/* Add margin top to container */}
        <Typography variant="h3" color="#1a1713" sx={{ fontFamily: 'Roboto', textAlign: 'center', mb: 2 }}>
          Register
        </Typography>
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
              display: 'flex',
              flexDirection: 'column',
              gap: 3, // Increase gap for better spacing
              alignItems: 'center',
              borderRadius: 2,
              p: 2,
            }}
          >
            <TextField
              color="#A0937D"
              type="file"
              name="profilePhoto"
              label=""
              fullWidth
              margin="normal"
              inputProps={{ accept: 'image/*' }}
              sx={{ mb: 2 }} // Add margin bottom to avoid overlap
            />
            <TextField
              required
              color="#A0937D"
              name="username"
              label="Username"
              fullWidth
              margin="normal"
            />
            <TextField
              required
              color="#A0937D"
              name="email"
              label="Email"
              type="email"
              fullWidth
              margin="normal"
            />
            <TextField
              required
              color="#A0937D"
              name="phoneNumber"
              label="Phone Number"
              type="tel"
              fullWidth
              margin="normal"
            />
            <TextField
              required
              color="#A0937D"
              name="password"
              label="Password"
              type="password"
              fullWidth
              margin="normal"
            />
            <TextField
              required
              color="#A0937D"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              fullWidth
              margin="normal"
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}> {/* Align to the left */}
              <FormLabel component="legend" sx={{ mb: 1 }}>Gender</FormLabel>
              <RadioGroup
                color="#A0937D"
                aria-label="gender"
                name="gender"
                value={gender}
                onChange={handleGenderChange}
                sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'  }} // Align radio buttons to the left
              >
                <FormControlLabel  value="female" control={<Radio />} label="Female" />
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="other" control={<Radio />} label="Other" />
              </RadioGroup>
            </Box>
            <Button variant="outlined" color="#A0937D">Register</Button>
            <Link
              component="button"
              variant="body2"
              onClick={() => {
                navigate('/'); // Navigate to the login page
              }}
              sx={{ mt: -2 }} // lessen margin top for better separation
            >
              Already have an account? Login here!
            </Link>
          </Box>
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default RegistrationPage;
