import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography, TextField, Avatar, IconButton, Menu, MenuItem, Box, ListItemIcon } from '@mui/material';
import Sidebar from './Sidebar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person'; // Icon for "My Profile"
import LogoutIcon from '@mui/icons-material/Logout'; // Icon for "Logout"
import avt1 from '../../../src/Assests/avt1.png';

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
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <AppBar
          position="fixed"
          sx={{
            zIndex: 1201,
            bgcolor: '#f4f4f4',
            color: '#2b2213',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            padding: '0 20px',
            width: `calc(100% - ${drawerOpen ? '240px' : '0px'})`,
            ml: `${drawerOpen ? '240px' : '0px'}`,
            mt: '0',  // Removed top margin
            borderRadius: '0px',  // Removed border radius
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <IconButton color="inherit" aria-label="open drawer" onClick={toggleDrawer} edge="start">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div">
              Checklist API
            </Typography>

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
              <IconButton onClick={handleAvatarClick} sx={{ ml: 1 }}>
                <Avatar alt="User" src={avt1} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                PaperProps={{
                  style: {
                    borderRadius: '10px',
                  },
                }}
              >
                <MenuItem onClick={handleMenuClose}>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  My Profile
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        <Sidebar open={drawerOpen} toggleDrawer={toggleDrawer} />

        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default DashboardLayout;
