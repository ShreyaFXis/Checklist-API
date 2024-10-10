import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon, Drawer } from '@mui/material';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import InfoIcon from '@mui/icons-material/Info';
import StoreIcon from '@mui/icons-material/Store';
import SettingsIcon from '@mui/icons-material/Settings';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const drawerWidth = 240;

// themes
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

const Sidebar = () => {
  return (
    <ThemeProvider theme={theme}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#F6E6CB',
            color: '#2b2213',
            boxShadow: '2px 0px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow for elevation
            mt: '1px', // Add space above the Drawer
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <List sx={{ mt: 3 }}>
          {/* Dashboard Link */}
          <ListItem button component={Link} to="/">
            <ListItemIcon>
              <DashboardIcon style={{ color: '#2b2213' }} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>

          {/* About Link */}
          <ListItem button component={Link} to="/about">
            <ListItemIcon>
              <InfoIcon style={{ color: '#2b2213' }} />
            </ListItemIcon>
            <ListItemText primary="About" />
          </ListItem>

          {/* Products Link */}
          <ListItem button component={Link} to="dashboard/products">
            <ListItemIcon>
              <StoreIcon style={{ color: '#2b2213' }} />
            </ListItemIcon>
            <ListItemText primary="Products" />
          </ListItem>

          {/* Settings Link */}
          <ListItem button component={Link} to="dashboard/settings">
            <ListItemIcon>
              <SettingsIcon style={{ color: '#2b2213' }} />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </Drawer>
    </ThemeProvider>
  );
};

export default Sidebar;
