import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography, TextField, Button, Avatar, IconButton, Box } from '@mui/material';
import Sidebar from './Sidebar';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create a custom theme with Roboto and custom colors
const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  palette: {
    background: {
      default: '#F6E6CB',
    },
    text: {
      primary: '#2b2213',
    },
  },
});

const DashboardLayout = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        {/* Add margin-top to AppBar */}
        <AppBar
          position="fixed"
          sx={{
            zIndex: 1201,
            bgcolor: '#F6E6CB',
            color: '#2b2213',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // subtle shadow for elevation
            padding: '0 20px',
            borderRadius: '20px 20px 20px 20px', // Curved edges for header
            width: `calc(100% - 240px)`, // Adjust width to fit outside the sidebar
            ml: '250px', // Margin to prevent overlap with the drawer
            mt: '10px', // Add space above the AppBar
            
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" component="div">
              Checklist API
            </Typography>

            {/* Search and Profile Section */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search..."
                sx={{
                  mr: 2,
                  bgcolor: '#ffffff',
                  color: '#2b2213',
                  borderRadius: '10px',
                }}
              />
              <IconButton sx={{ ml: 1 }}>
                <Avatar alt="User" src="/static/images/avatar/1.jpg" />
              </IconButton>
              <Button color="inherit" sx={{ color: '#2b2213', ml: 2 }}>
                Logout
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Sidebar with margin-top */}
        <Sidebar />

        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, mt: 8 }}
        >
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default DashboardLayout;
