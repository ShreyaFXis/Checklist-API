import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom'; 
import { Accordion, AccordionSummary, AccordionDetails, Typography, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Divider} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CloseIcon from '@mui/icons-material/Close';
import noItems from '../../../Assests/NoItemsYet.gif';

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
  const [openItemModal, setOpenItemModal] = useState(false);
  const [newChecklistItemText, setNewChecklistItemText] = useState('');
  const [selectedChecklistId] = useState(null);
  const [selectedChecklistForItem, setSelectedChecklistForItem] = useState(null);
  
  const [expandedAccordions, setExpandedAccordions] = useState([]);

  const handleAccordionChange = (panel) => () => {
    setExpandedAccordions((prev) =>
      prev.includes(panel) ? prev.filter((p) => p !== panel) : [...prev, panel]
    );
  };

  const [searchParams] = useSearchParams(); // Get URL search params
  const searchTerm = searchParams.get('search')?.toLowerCase() || ''; // Get search term and convert to lowercase

  const [openModal, setOpenModal] = useState(false);
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  
  
  // UseEffect for fetching checklists
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
      handleCloseModal();

      toast.success('Checklist created successfully!',{
        position: 'top-center'
      });  
      
    } catch (err) {
      setError(err.message || 'Error creating checklist.');
    }
  };

  // Handle open item modal for checklist items
   const handleOpenItemModal = (checklistId) => {
    setSelectedChecklistForItem(checklistId);
    setOpenItemModal(true);
  };

  const handleCloseItemModal = () => {
    setOpenItemModal(false);
    setNewChecklistItemText('');
  };

  const handleCreateChecklistItem = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('No token found. Please log in.');
      return;
    }

    if (!selectedChecklistForItem) {
      setError('Please select a checklist for this item.');
      return;
    }


    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/checklists/items`, {
        text: newChecklistItemText,
        checklist: selectedChecklistForItem,
        //checklist : checklistId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedChecklists = checklists.map((checklist) => 
        checklist.id === selectedChecklistId 
          ? { ...checklist, items: [...checklist.items, response.data] }
          : checklist
      );
      setChecklists(updatedChecklists);
      handleCloseItemModal();

      toast.success('Checklist item created successfully!', {
        position: 'top-center',
      });
    } catch (err) {
      setError(err.message || 'Error creating checklist item.');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error fetching checklists: {error}</Typography>;

  const tableHeaders = [    // For the Checkbox header
    { label: '', sx: { fontWeight: 'bold', color: 'text.primary', textAlign: 'center', borderRight: '0.5px solid #333', borderBottom: '0.5px solid #333' } }, 
    { label: '#', sx: { fontWeight: 'bold', color: 'text.primary', textAlign: 'center', borderRight: '0.5px solid #333', borderBottom: '0.5px solid #333' } },
    { label: 'Item', sx: { fontWeight: 'bold', color: 'text.primary', textAlign: 'center', borderRight: '0.5px solid #333', borderBottom: '0.5px solid #333' } },
    { label: 'Updated On', sx: { fontWeight: 'bold', color: 'text.primary', textAlign: 'center', borderRight: '0.5px solid #333', borderBottom: '0.5px solid #333' } },
  ];

  return (
    <ThemeProvider theme={theme}>
      

      <Box sx={{ bgcolor: 'background.default', p: 2 }}>
        <div className='wrapper-class' style={{display:'flex', alignContent:'stretch'}}>
        <Typography variant="h4" 
        // sx={{ textAlign: 'left', color: 'text.primary', mb: 2 }}
        >
          CheckLists
        </Typography>

        <Button
          variant="contained"
          sx={{
            textTransform: 'none', // Keeps the text in sentence case
            background: 'linear-gradient(270deg, #3494e6, #ec6ead)', // Initial gradient
            backgroundSize: '200% 200%', // Double the background size to enable the motion effect
            marginBottom: '16px', // Adds space below the button
            color: '#000', // Change text color to suit the background
            transition: 'background-position 0.5s ease', // Smooth transition for the gradient movement
            backgroundPosition: '0% 50%', // Start position of the background gradient
            '&:hover': {
              backgroundPosition: '100% 50%', // On hover, shift the background gradient
              background: 'linear-gradient(270deg, #3494e6, #ec6ead)',
            },
            marginLeft: 'auto', // Align the button to the right
            display: 'block', // Ensure the button takes block space so marginLeft works
          }}
          onClick={handleOpenModal}
        >
          Create Checklist
        </Button>

        <Button
        
          variant="contained"
          sx={{
            textTransform: 'none', // Keeps the text in sentence case
            background: 'linear-gradient(270deg, #ec6ead,#3494e6)', // Initial gradient
            backgroundSize: '200% 200%', // Double the background size to enable the motion effect
            marginBottom: '16px', // Adds space below the button
            color: '#000', // Change text color to suit the background
            transition: 'background-position 0.5s ease', // Smooth transition for the gradient movement
            backgroundPosition: '0% 50%', // Start position of the background gradient
            '&:hover': {
              backgroundPosition: '100% 50%', // On hover, shift the background gradient
              background: 'linear-gradient(270deg, #3494e6, #ec6ead)',
            },
            marginLeft: '25px', // Align the button to the right
            display: 'block', // Ensure the button takes block space so marginLeft works
          }}
          onClick={() =>  handleOpenItemModal(null)}
        >
          Create Checklist-Item
        </Button>

        </div>

      
        <Paper>
          {filteredChecklists.length > 0 ? (
            filteredChecklists.map((checklist) => (
              <Accordion key={checklist.id} onChange={handleAccordionChange(checklist.id)} expanded={expandedAccordions.includes(checklist.id)}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ cursor: 'pointer', color: 'text.primary' }}>
                  <Typography sx={{ fontWeight: expandedAccordions.includes(checklist.id) ? 'bold' : 'normal' }}>
                    {` ${checklist.title}`}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                 sx={{
                  transition: 'all 0.3s ease-in-out', // Smooth transition
                  minHeight: expandedAccordions.includes(checklist.id) ? 'auto' : '50px', // Consistent space
                  maxHeight: expandedAccordions.includes(checklist.id) ? 'none' : '50px', // Adjust height when collapsed
                  overflow: 'hidden' // Hide overflow when collapsed
                }}
                >
                  {/* Table for checklist items */}
                  <TableContainer sx={{ width: '80%', margin: '0 auto', tableLayout: 'fixed', maxHeight: 300,  overflowY: 'auto', borderBottom: checklist.items.length > 0 ? '1px solid #333' : 'none'}}>
                    {checklist.items.length > 0 ? (
                      <Table sx={{ bgcolor: '#eeeee', border: '1px solid #333'}}>
                        <TableHead>
                          <TableRow>
                            {tableHeaders.map((header, index) => (
                              <TableCell key={index} sx={header.sx}>
                                {header.label}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody sx={{ bgcolor: '#eeeee', border: '1px solid #333'}}>
                          {checklist.items.map((item, idx) => (
                            <TableRow 
                              key={item.id}
                              sx={{
                                '&:hover': { backgroundColor: '#e8e8e8' }
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
                      <Box
                        sx={{
                          border: '1px solid #ccc', // Add a border
                          borderRadius: '4px',      // Rounded corners
                          padding: 1,               // Padding inside the box
                          margin: 1,                // Margin outside the box
                          textAlign: 'center',      // Center text alignment
                          backgroundColor: '#f9f9f9' // Optional: background color
                        }}
                      >
                        <img src={noItems} style={{ width: '150px', height: 'auto' }} alt="No items"/> 
                        <Typography variant="h6" align="center" sx={{ margin: 1 }}>
                          No checklist items added.
                        </Typography>
                      </Box>
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
      
         {/* Checklist item creation modal */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="md" > {/* Adjust width as needed */}
         <div >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
            <Typography variant="h6">
              Create Checklist
            </Typography>

          {/* Close Icon on the right */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CloseIcon  sx={{ cursor: 'pointer'}} onClick={handleCloseModal} />
            </Box>
            </DialogTitle>

        {/* Divider */}
        <Divider sx={{ my: 1 }} />

        </div>

          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              padding= "15px 15px"
              label="Checklist Title"
              type="text"
              fullWidth
              variant="outlined"
              value={newChecklistTitle}
              onChange={(e) => setNewChecklistTitle(e.target.value)}
            />
             
          </DialogContent>
          <Divider sx={{ my: 1 }} /> {/* Divider below the text field */}
          <DialogActions sx={{ justifyContent: 'flex-end' }}>
            <Button variant= "contained" onClick={handleCreateChecklist} color="primary">
              Create
            </Button>
          </DialogActions>
      </Dialog>
          
        {/* Checklist item creation modal */}
      <Dialog open={openItemModal} onClose={handleCloseItemModal} fullWidth maxWidth="md" >

        <div >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Title on the left */}
          <Typography variant="h6">
            Add Checklist Item
          </Typography>

          {/* Close Icon on the right */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CloseIcon sx={{ cursor: 'pointer'}} onClick={handleCloseItemModal} />
          </Box>
          </DialogTitle>

          {/* Divider */}
          <Divider sx={{ my: 0.5 }} />
        </div>

        <DialogContent>
          <TextField
            label="Checklist Item"
            value={newChecklistItemText}
            onChange={(e) => setNewChecklistItemText(e.target.value)}
            fullWidth
          />

          <formcontrol>
          <TextField
    select
    label="Select Checklist"
    value={selectedChecklistForItem}
    onChange={(e) => setSelectedChecklistForItem(e.target.value)}
    fullWidth
    sx={{ marginTop: '16px' }}
  >
    {/* Placeholder MenuItem
    <MenuItem value="">
      <em>Select Checklist</em>
    </MenuItem> */}
    {checklists.map((checklist) => (
      <MenuItem key={checklist.id} value={checklist.id}>
        {checklist.title}
      </MenuItem>
    ))}
  </TextField>
          </formcontrol>
         

        </DialogContent>
        <Divider sx={{ my: 0.5 }} />
        <DialogActions sx={{ justifyContent: 'flex-end' }}>
            <Button variant= "contained" onClick={handleCreateChecklistItem} color="primary">
              Add
            </Button>
          </DialogActions>
      </Dialog>
      
      <ToastContainer/>
    </ThemeProvider>
  );
};

export default Checklists;
