import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  palette: {
    background: {
      default: '#EAEAEA', 
    },
    text: {
      primary: '#2b2213', 
    },
  },
});

const Checklists = () => {
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true); // Initially set loading to true
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChecklists = async () => {
      try {

        // Fetch token from localStorage
        const token = localStorage.getItem('token');

        if (!token) {
          setError('No token found. Please log in.');
          setLoading(false);
          return;
        }

        // Fetch checklists with authorization header
        const response = await axios.get('http://127.0.0.1:8000/api/checklists', {
          headers: {
            'Authorization': `Bearer ${token}` 
          }
        });

        // Set the checklists from the response
        setChecklists(response.data);
      } catch (err) {
        setError(err.message || 'Error fetching checklists.');
      } finally {
        setLoading(false);
      }
    };

    fetchChecklists();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error fetching checklists: {error}</Typography>;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', p: 2 }}>
        <Typography variant="h4" sx={{ textAlign: 'center', color: 'text.primary', mb: 2 }}>CheckLists</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Checklist Title</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {checklists.map((checklist) => (
                <TableRow key={checklist.id}>
                  <TableCell sx={{ color: 'text.primary' }}>{checklist.title}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </ThemeProvider>
  );
};

export default Checklists;
