import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox} from '@mui/material';
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
  
  const [searchParams] = useSearchParams(); // Get URL search params
  const searchTerm = searchParams.get('search')?.toLowerCase() || ''; // Get search term and convert to lowercase

  useEffect(() => {
    const fetchChecklists = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setError('No token found. Please log in.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://127.0.0.1:8000/api/checklists`, {
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

  // Filter checklists based on search term
  const filteredChecklists = searchTerm
    ? checklists.filter(checklist => checklist.title.toLowerCase().includes(searchTerm))
    : checklists; // Show all checklists if search term is empty


  const handleCheckboxChange = async (checklistId, itemId) => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('No token found. Please log in.');
      return;
    }
    // Logic for handling checkbox change 
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
          {filteredChecklists.length > 0 ? (
            filteredChecklists.map((checklist) => (
              <Accordion key={checklist.id}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ cursor: 'pointer', color: 'text.primary' }}
                >
                  <Typography>{`  ${checklist.title}`}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {/* Table for checklist items */}
                  <TableContainer component={Paper} sx={{ width: '80%', margin: '0 auto', tableLayout: 'fixed', maxHeight: 300, overflowY: 'auto' }}>
                    {checklist.items.length > 0 ? (
                      <Table sx={{ bgcolor: '#eeeee', border: '1px solid #333'}}>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', color: 'text.primary', textAlign: 'center',borderRight: '0.5px solid #333', borderBottom: '0.5px solid #333' }}>
                              {/* Checkbox Header */}
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'text.primary', textAlign: 'center',borderRight: '0.5px solid #333', borderBottom: '0.5px solid #333' }}>
                              #
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'text.primary', textAlign: 'center',borderRight: '0.5px solid #333', borderBottom: '0.5px solid #333' }}>
                              Item
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'text.primary', textAlign: 'center',borderRight: '0.5px solid #333', borderBottom: '0.5px solid #333' }}>
                              Updated On
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {checklist.items.map((item, idx) => (
                            <TableRow
                              key={item.id}
                              sx={{
                                '&:hover': { backgroundColor: '#e8e8e8' },
                              }}
                            >
                              <TableCell sx={{ borderBottom: '1px solid #ccc',borderRight: '0.5px solid #333', textAlign: 'center' }}>
                                <Checkbox
                                  checked={item.is_checked}
                                  onChange={() => handleCheckboxChange(checklist.id, item.id)}
                                />
                              </TableCell>
                              <TableCell sx={{ color: 'text.primary', borderBottom: '1px solid #ccc',borderRight: '0.5px solid #333', textAlign: 'center' }}>
                                {idx + 1}
                              </TableCell>
                              <TableCell sx={{ color: 'text.primary', borderBottom: '1px solid #ccc', borderRight: '0.5px solid #333',textAlign: 'center' }}>
                                <span style={{ textDecoration: item.is_checked ? 'line-through' : 'none' }}>
                                  {item.text}
                                </span>
                              </TableCell>
                              <TableCell sx={{ color: 'text.primary', borderBottom: '1px solid #ccc',borderRight: '0.5px solid #333', textAlign: 'center' }}>
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
            ))
          ) : (
            <Typography variant="h6" align="center" sx={{ margin: 2 }}>
              No checklists found for the search term.
            </Typography>
          )}
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default Checklists;
