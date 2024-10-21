import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom'; // useNavigate instead of navigate
import { Accordion, AccordionSummary, AccordionDetails, Typography, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [filteredChecklists, setFilteredChecklists] = useState([]); // Add filteredChecklists state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchParams] = useSearchParams(); // Get URL search params
  const searchTerm = searchParams.get('search')?.toLowerCase() || ''; // Get search term and convert to lowercase

  const [openModal, setOpenModal] = useState(false);
  const [newChecklistTitle, setNewChecklistTitle] = useState('');

  
  const navigate = useNavigate(); // Use navigate hook

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

    // UseEffect for filtering checklists
    useEffect(() => {
      const filtered = searchTerm
        ? checklists.filter((checklist) => checklist.title.toLowerCase().includes(searchTerm))
        : checklists;
      setFilteredChecklists(filtered); // Set the filtered checklists
    }, [checklists, searchTerm]); // Run the effect whenever checklists or searchTerm changes

  const handleCheckboxChange = async (checklistId, itemId) => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('No token found. Please log in.');
      return;
    }
    // Logic for handling checkbox change 
  };

  const handleNewChecklistClick = () => {
    setOpenModal(true);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewChecklistTitle('');
  };

  const handleCreateChecklist = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('No token found. Please log in.');
      return;
    }

    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/checklists`, {
        title: newChecklistTitle,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setChecklists(prev => [...prev, response.data]);

      toast.success('Checklist created successfully!');
      console.log(toast);
      
      setTimeout(() => {
        handleCloseModal();
      }, 2000); 
      
    } catch (err) {
      setError(err.message || 'Error creating checklist.');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error fetching checklists: {error}</Typography>;

  return (
    <ThemeProvider theme={theme}>
       <Button
          variant="contained"
          sx={{
            textTransform: 'none',                        // Keeps the text in sentence case
            background: 'linear-gradient(270deg, #ec6ead,#3494e6 )',  // Initial gradient
            backgroundSize: '200% 200%', // Double the background size to enable the motion effect
            marginBottom: '16px', // Adds space below the button
            color: '#000', // Change text color to suit the background
            transition: 'background-position 0.5s ease', // Smooth transition for the gradient movement
            backgroundPosition: '0% 50%', // Start position of the background gradient
            '&:hover': {
              backgroundPosition: '100% 50%', // On hover, shift the background gradient
              background: 'linear-gradient(270deg, #3494e6, #ec6ead)',
            },
            
          }} onClick={handleOpenModal}
        >
          Create Checklist
        </Button>

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

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Create New Checklist</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Checklist Title"
            type="text"
            fullWidth
            variant="outlined"
            value={newChecklistTitle}
            onChange={(e) => setNewChecklistTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">Cancel</Button>
          <Button onClick={handleCreateChecklist} color="primary">Create</Button>
        </DialogActions>
      </Dialog>

    </ThemeProvider>
  );
};

export default Checklists;
