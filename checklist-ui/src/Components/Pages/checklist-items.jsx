import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Box, Button } from '@mui/material';
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

const ChecklistItems = () => {
  const { checklistId } = useParams(); 
  const [checklist, setChecklist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchChecklistItems = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setError('No token found. Please log in.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://127.0.0.1:8000/api/checklists/${checklistId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setChecklist(response.data);
      } catch (err) {
        setError(err.message || 'Error fetching checklist items.');
      } finally {
        setLoading(false);
      }
    };

    fetchChecklistItems();
  }, [checklistId]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error fetching checklist items: {error}</Typography>;
  if (!checklist) return <Typography>Checklist not found.</Typography>;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', p: 2 }}>
        <Typography variant="h4" sx={{ textAlign: 'center', color: 'text.primary', mb: 2 }}>
          {checklist.title}
        </Typography>
        
        {/* Table for checklist items */}
        {checklist.items.length > 0 ? (
      <TableContainer component={Paper} sx={{ width: '50%', margin: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: 'text.primary' }}>Item</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: 'text.primary' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {checklist.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell align="center" sx={{ color: 'text.primary' }}>{item.text}</TableCell>
                <TableCell align="center" sx={{ color: 'text.primary' }}>
                  {item.is_checked ? 'Completed' : 'Incomplete'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
) : (
  <Typography align="center" sx={{ mt: 2, color: 'text.primary' }}>
    No checklist items available.
  </Typography>
)}


  
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/checklists')} 
          >
            Back to Checklists
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ChecklistItems;