import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios'; // Import Axios
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthLayout from '../Layouts/AuthLayout';

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
      toast.error("Passwords do not match.");
      return;
    }

    // Create form data object to send profile photo as well
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('confirm_password', confirm_password); // Fix typo
    formData.append('gender', gender);
    formData.append('phone_number', phoneNumber);
    if (profilePhoto) {
      formData.append('profile_photo', profilePhoto);
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register', formData);
      toast.success("Registration successful!");
      setTimeout(() => {
        navigate('/login'); // Redirect after a short delay
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.error);
        toast.error(error.response.data.error);
      } else {
        setErrorMessage('Registration failed. Please try again.');
        toast.error('Registration failed. Please try again.');
      }
    }
  };

  return (
    <>
      <AuthLayout>
        <ToastContainer />

        <Container maxWidth="sm" sx={{ mt: 4 }}>
          <Typography variant="h4" color="#1a1713" sx={{ fontFamily: 'Roboto', textAlign: 'center', mb: 4 }}>
            Register
          </Typography>

          {/* Profile Photo Upload */}
          <TextField
            color="#A0937D"
            type="file"
            name="profilePhoto"
            fullWidth
            margin="normal"
            inputProps={{ accept: 'image/*' }}
            onChange={handleProfilePhotoChange}
            sx={{ mb: 2 }}
          />

          {/* Username Input */}
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

          {/* Email Input */}
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

          {/* Phone Number Input */}
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

          {/* Password Input */}
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

          {/* Confirm Password Input */}
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

          {/* Error Message Display */}
          {errorMessage && (
            <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
              {errorMessage}
            </Typography>
          )}

          {/* Gender Selection */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', mt: 2 }}>
            <FormLabel component="legend" sx={{ mb: 1 }}>Gender</FormLabel>
            <RadioGroup
              color="#A0937D"
              aria-label="gender"
              name="gender"
              value={gender}
              onChange={handleGenderChange}
              sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}
            >
              <FormControlLabel value="female" control={<Radio />} label="Female" />
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="other" control={<Radio />} label="Other" />
            </RadioGroup>
          </Box>

          {/* Register Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 4, py: 1.5 }}
            onClick={handleRegister}
          >
            Register
          </Button>

          {/* Already have an account? Link */}
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate('/login')}
            sx={{ display: 'block', textAlign: 'center', mt: 2 }}
          >
            Already have an account? Login here!
          </Link>

        </Container>
      </AuthLayout>
    </>
  );
};

export default RegistrationPage;
