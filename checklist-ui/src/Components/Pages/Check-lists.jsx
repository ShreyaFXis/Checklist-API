import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChecklists = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setError('No token found. Please log in.');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://127.0.0.1:8000/api/checklists', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setChecklists(response.data);
      } catch (err) {
        setError(err.message || 'Error fetching checklists.');
      } finally {
        setLoading(false);
      }
    };

    fetchChecklists();
  }, []);

  const handleCheckboxChange = async (checklistId, itemId) => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('No token found. Please log in.');
      return;
    }

    try {
      // Call your API to update the item status (toggle checked/unchecked)
      await axios.patch(`http://127.0.0.1:8000/api/checklists/${checklistId}/items/${itemId}/`, {
        is_checked: !checklists.find((c) => c.id === checklistId).items.find((item) => item.id === itemId).is_checked,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh the checklist items after updating
      const updatedChecklists = [...checklists];
      const checklistIndex = updatedChecklists.findIndex((c) => c.id === checklistId);
      const itemIndex = updatedChecklists[checklistIndex].items.findIndex((item) => item.id === itemId);

      // Toggle the is_checked property
      updatedChecklists[checklistIndex].items[itemIndex].is_checked = !updatedChecklists[checklistIndex].items[itemIndex].is_checked;

      setChecklists(updatedChecklists);
    } catch (err) {
      console.error('Error updating item status:', err);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error fetching checklists: {error}</Typography>;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', p: 2 }}>
        <Typography variant="h4" sx={{ textAlign: 'center', color: 'text.primary', mb: 2 }}>
          CheckLists
        </Typography>

        <Paper>
          {checklists.map((checklist) => (
            <Accordion key={checklist.id}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ cursor: 'pointer', color: 'text.primary' }}
              >
                <Typography>{`  ${checklist.title}`}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {/* Table for checklist items */}
                <TableContainer component={Paper} sx={{ width: '100%', margin: '0 auto' }}> {/* Reduced table width and centered */}
  {checklist.items.length > 0 ? (
    <Table sx={{ bgcolor: '#f2f2f2', border: '1px solid #333', borderRadius: 0 }}>
      <TableHead>
        <TableRow>
          <TableCell
            sx={{
              fontWeight: 'bold',
              color: 'text.primary',
              textAlign: 'center',
              borderRight: '0.5px solid #333',
              borderBottom: '0.5px solid #333',
            }}
          >
            {/* Checkbox Header */}
          </TableCell>
          <TableCell
            sx={{
              fontWeight: 'bold',
              color: 'text.primary',
              textAlign: 'center', // Center-align text
              borderRight: '0.5px solid #333',
              borderBottom: '0.5px solid #333',
            }}
          >
            #
          </TableCell>
          <TableCell
            sx={{
              fontWeight: 'bold',
              color: 'text.primary',
              textAlign: 'center', // Center-align text
              borderRight: '0.5px solid #333',
              borderBottom: '0.5px solid #333',
            }}
          >
            Item
          </TableCell>
          <TableCell
            sx={{
              fontWeight: 'bold',
              color: 'text.primary',
              textAlign: 'center', // Center-align text
              borderBottom: '0.5px solid #333',
            }}
          >
            Updated On
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {checklist.items.map((item, idx) => (
          <TableRow
            key={item.id}
            sx={{
              '&:hover': { backgroundColor: '#e6e6e6' }, // Hover effect
            }}
          >
            <TableCell sx={{ borderRight: '0.5px solid #333', borderBottom: '1px solid #ccc', textAlign: 'center' }}>
              <Checkbox
                checked={item.is_checked}
                onChange={() => handleCheckboxChange(checklist.id, item.id)} // Call the function on checkbox change
              />
            </TableCell>
            <TableCell sx={{ color: 'text.primary', borderRight: '0.5px solid #333', borderBottom: '1px solid #ccc', textAlign: 'center' }}>
              {idx + 1} {/* Index number */}
            </TableCell>
            <TableCell sx={{ color: 'text.primary', borderRight: '0.5px solid #333', borderBottom: '1px solid #ccc', textAlign: 'center' }}>
              <span style={{ textDecoration: item.is_checked ? 'line-through' : 'none' }}>
                {item.text}
              </span>
            </TableCell>
            <TableCell sx={{ color: 'text.primary', borderBottom: '1px solid #ccc', textAlign: 'center' }}>
              {new Date(item.updated_on).toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <Typography variant="h6" align="center" sx={{ margin: 2 }}>
      No checklist items available.
    </Typography>
  )}
</TableContainer>


              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default Checklists;
