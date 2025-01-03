import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <React.Fragment>
      <CssBaseline />
      <ToastContainer />
      <Container maxWidth="sm">
        <Box
          sx={{
            bgcolor: '#EFEFEF',
            padding: 4,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Box component={Paper} sx={{ padding: 3 }}>
            <Outlet/>
          </Box>
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default AuthLayout;