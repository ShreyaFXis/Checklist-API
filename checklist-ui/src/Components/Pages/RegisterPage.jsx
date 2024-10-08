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
import { useState } from 'react';
import axios from 'axios'; // Import Axios

const RegistrationPage = () => {
  const [gender, setGender] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null); // Add profile photo state
  const [errorMessage, setErrorMessage] = useState(''); // Error message state

  const navigate = useNavigate();

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleProfilePhotoChange = (event) => {
    setProfilePhoto(event.target.files[0]);
  };

  const handleRegister = async () => {
    if (password !== confirm_password) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    // Create form data object to send profile photo as well
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('confirm_password',confirm_password);
    formData.append('gender', gender);
    formData.append('phone_number', phoneNumber);
    if (profilePhoto) {
      formData.append('profile_photo', profilePhoto);
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // On successful registration, navigate to the login page
      console.log('Registration successful:', response.data);
      navigate('/');

    } catch (error) {
      // Handle registration errors and display them
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.error); // Display backend error message
      } else {
        setErrorMessage('Registration failed. Please try again.');
      }
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h3" color="#1a1713" sx={{ fontFamily: 'Roboto', textAlign: 'center', mb: 2 }}>
          Register
        </Typography>
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
              gap: 3,
              alignItems: 'center',
              borderRadius: 2,
              p: 2,
            }}
          >
            <TextField
              color="#A0937D"
              type="file"
              name="profilePhoto"
              fullWidth
              margin="normal"
              inputProps={{ accept: 'image/*' }}
              onChange={handleProfilePhotoChange} // Handle profile photo change
              sx={{ mb: 2 }}
            />
            <TextField
              required
              color="#A0937D"
              name="username"
              label="Username"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              required
              color="#A0937D"
              name="email"
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              required
              color="#A0937D"
              name="phoneNumber"
              label="Phone Number"
              type="tel"
              fullWidth
              margin="normal"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <TextField
              required
              color="#A0937D"
              name="password"
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              required
              color="#A0937D"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              fullWidth
              margin="normal"
              value={confirm_password}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {/* Error message display */}
            {errorMessage && (
              <Typography color="error" sx={{ mt: 1 }}>
                {errorMessage}
              </Typography>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
              <FormLabel component="legend" sx={{ mb: 1 }}>Gender</FormLabel>
              <RadioGroup
                color="#A0937D"
                aria-label="gender"
                name="gender"
                value={gender}
                onChange={handleGenderChange}
                sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}
              >
                <FormControlLabel value="female" control={<Radio />} label="Female" />
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="other" control={<Radio />} label="Other" />
              </RadioGroup>
            </Box>

            <Button variant="outlined" color="#A0937D" onClick={handleRegister}>
              Register
            </Button>

            <Link
              component="button"
              variant="body2"
              onClick={() => {
                navigate('/'); // Navigate to login page
              }}
              sx={{ mt: -2 }}
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
