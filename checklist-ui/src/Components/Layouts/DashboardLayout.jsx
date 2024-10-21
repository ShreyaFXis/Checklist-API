import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // To handle redirection
import { AppBar, Toolbar, Typography, TextField, Avatar, IconButton, Menu, MenuItem, Box, ListItemIcon } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person'; 
import LogoutIcon from '@mui/icons-material/Logout'; 
import avt1 from '../../../src/Assests/avt1.png';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

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
  const [searchTerm, setSearchTerm] = useState(''); // search input
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  // Debounce effect 
  useEffect(() => {
  
      var delayDebounceFn = setTimeout(() => {
        if (searchTerm) {
          navigate(`/checklists?search=${searchTerm}`);
        }
       
      }, 500); // Delay of 500ms
    
 
    return () => clearTimeout(delayDebounceFn); // Cleanup on unmount or when searchTerm changes
  }, [searchTerm, navigate]);

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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Update search term
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
