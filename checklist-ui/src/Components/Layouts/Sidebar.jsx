import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, ListItemIcon, Drawer, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import InfoIcon from '@mui/icons-material/Info';
import StoreIcon from '@mui/icons-material/Store';
import SettingsIcon from '@mui/icons-material/Settings';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import logo from '../../../src/Assests/logo.png';


const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  palette: {
    text: {
      primary: '#2b2213',
    },
  },
});

const Sidebar = ({ open }) => {
  const drawerWidth = open ? 240 : 'auto';
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  return (
    <ThemeProvider theme={theme}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#EAEAEA',
            color: '#2b2213',
            boxShadow: '2px 0px 10px rgba(0, 0, 0, 0.1)',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        {/* Adjusted spacing around logo */}
        <Box sx={{ p: 1, textAlign: 'center' }}>
          <img src={logo} alt="Logo" style={{ width: '120px', height: '120px' }} /> {/* Reduced logo size */}
        </Box>

        {/* Reduced spacing between logo and menu items */}
        <List sx={{ mt: -3 }}>
          {/* Dashboard Link */}
          <ListItem
            button
            component={Link}
            to="/"
            style={{ backgroundColor: activeLink === '/' ? '#c7c7c7' : 'transparent' }}
          >
            <ListItemIcon>
              <DashboardIcon style={{ color: '#2b2213', fontWeight: activeLink === '/' ? 'bold' : 'normal' }} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>

          {/* Checklist Link */}
          <ListItem
            button
            component={Link}
            to="/checklists"
            style={{ backgroundColor: activeLink === '/checklists' ? '#c7c7c7' : 'transparent' }}
          >
            <ListItemIcon>
              <LibraryBooksIcon style={{ color: '#2b2213', fontWeight: activeLink === '/checklists' ? 'bold' : 'normal' }} />
            </ListItemIcon>
            <ListItemText primary="Checklist" />
          </ListItem>

          {/* About Link */}
          <ListItem
            button
            component={Link}
            to="/about"
            style={{ backgroundColor: activeLink === '/about' ? '#c7c7c7' : 'transparent' }}
          >
            <ListItemIcon>
              <InfoIcon style={{ color: '#2b2213', fontWeight: activeLink === '/about' ? 'bold' : 'normal' }} />
            </ListItemIcon>
            <ListItemText primary="About" />
          </ListItem>

          {/* Products Link */}
          <ListItem
            button
            component={Link}
            to="dashboard/products"
            style={{ backgroundColor: activeLink === '/dashboard/products' ? '#c7c7c7' : 'transparent' }}
          >
            <ListItemIcon>
              <StoreIcon style={{ color: '#2b2213', fontWeight: activeLink === '/dashboard/products' ? 'bold' : 'normal' }} />
            </ListItemIcon>
            <ListItemText primary="Products" />
          </ListItem>

          {/* Settings Link */}
          <ListItem
            button
            component={Link}
            to="dashboard/settings"
            style={{ backgroundColor: activeLink === '/dashboard/settings' ? '#c7c7c7' : 'transparent' }}
          >
            <ListItemIcon>
              <SettingsIcon style={{ color: '#2b2b2b', fontWeight: activeLink === '/dashboard/settings' ? 'bold' : 'normal' }} />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </Drawer>
    </ThemeProvider>
  );
};

export default Sidebar;