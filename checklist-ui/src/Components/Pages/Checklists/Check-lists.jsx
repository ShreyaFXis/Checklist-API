import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import {
  Accordion, AccordionSummary, AccordionDetails, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Checkbox, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Divider, Skeleton,  
  LinearProgress, Pagination, 
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import noItems from "../../../Assests/NoItemsYet.gif";

const theme = createTheme({
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
  palette: {
    background: {
      default: "#EAEAEA",
    },
    text: {
      primary: "#2b2213",
    },
  },
});

const Checklists = () => {
  const [checklists, setChecklists] = useState([]);
  const [filteredChecklists, setFilteredChecklists] = useState([]); // Add filteredChecklists state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openItemModal, setOpenItemModal] = useState(false);
  const [newChecklistItemText, setNewChecklistItemText] = useState("");
  const [selectedChecklistId] = useState(null);
  const [selectedChecklistForItem, setSelectedChecklistForItem] = useState(null);
  const [titleError, setTitleError] = useState(false);
  const [itemTextError, setItemTextError] = useState(false);
  const [TextError, setTextError] = useState(false);
  const [checklistSelectError, setChecklistSelectError] = useState("");
  const [checklistItems, setChecklistItems] = useState({});
  const [loadingItems, setLoadingItems] = useState({});
  const [newItemText, setNewItemText] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [expandedAccordions, setExpandedAccordions] = useState([]);
  const [checklistId, setChecklistId] = useState(null);

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedItemText, setSelectedItemText] = useState('');  // Store the item text only
  const [currentChecklistId, setCurrentChecklistId] = useState(null);  // Store checklist ID
  const [itemId, setItemId] = useState(null); // Store item ID  
  // Pagination state
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10); // Adjust items per page as needed
  const [itemsPage, setItemsPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [paginationState, setPaginationState] = useState({}); // Manage pagination per checklist
  

  const [searchParams] = useSearchParams(); // Get URL search params
  const searchTerm = searchParams.get("search")?.toLowerCase() || ""; // Get search term and convert to lowercase

  const [openModal, setOpenModal] = useState(false);
  const [newChecklistTitle, setNewChecklistTitle] = useState("");
 

  // handle accordion changes
  const handleAccordionChange = (panelId) => async () => {
    setExpandedAccordions((prev) =>
      prev.includes(panelId)
        ? prev.filter((id) => id !== panelId)
        : [...prev, panelId]
    );

    if (!expandedAccordions.includes(panelId)) {
      await fetchChecklistItems(panelId, 1); // Fetch page 1 by default
    }
  };

  const fetchChecklistItems = async (checklistId, page = 1) => {
    setLoadingItems((prev) => ({ ...prev, [checklistId]: true }));
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found. Please log in.");
        return;
      }
  
      const response = await axios.get(
        `http://127.0.0.1:8000/api/checklists/${checklistId}/items?page=${page}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      // Update items and pagination state
      setChecklistItems((prevItems) => ({
        ...prevItems,
        [checklistId]: response.data.results,
      }));
  
      setPaginationState((prevState) => ({
        ...prevState,
        [checklistId]: {
          currentPage: page,
          totalPages: response.data.total_pages || 1,
        },
      }));
      console.log("totalPages : ",totalPages)
    } catch (err) {
      toast.error(
        `Error fetching checklist items: ${err.message || "Unknown error"}`
      );
    } finally {
      setLoadingItems((prev) => ({ ...prev, [checklistId]: false }));
    }
  };
  
  

  // Handle page change for checklist items
  const handleItemsPageChange = async (event, newPage, checklistId) => {
    console.log(`Fetching page ${newPage} for checklist ${checklistId}`); // Debug log
    await fetchChecklistItems(checklistId, newPage); // Fetch data directly for the new page
  };
  

  // UseEffect for fetching checklists
  useEffect(() => {
    const fetchChecklists = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No token found. Please log in.");
          setLoading(false);
          return;
        }
        //console.log(page);
        const response = await axios.get(
          `http://127.0.0.1:8000/api/checklists?page=${page}&titles_only=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        //console.log("Response : ");
        //console.log(response.data);
        setChecklists(response.data.results || []); // Paginated results
        setTotalPages(Math.ceil(response.data.count / itemsPerPage)); // Total pages
      } catch (err) {
        setError(err.message || "Error fetching checklists.");
      } finally {
        setLoading(false);
      }
    };

    fetchChecklists();
  }, [page]);

  // UseEffect for filtering checklists
  useEffect(() => {
    const filtered = searchTerm
      ? checklists.filter((checklist) =>
          checklist.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : checklists;
  
    setFilteredChecklists(filtered); // Set filtered checklists
      
   // console.log("checklists ::::: ",checklists);
    //console.log("filter ::::: ",filtered);
  
  }, [checklists, searchTerm]);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  
  const handleCheckboxChange = async (checklistId, itemId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("No token found. Please log in.");
      return;
    }
    // Logic for handling checkbox change
  };

  // Handle open item modal for checklist
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewChecklistTitle("");
  };

  // Handle create checklist
  const handleCreateChecklist = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    if (!newChecklistTitle.trim()) {
      setTitleError("Title can't be empty.", {
        position: "top-center",
      });
      return;
    }

    /* const existingTitles = checklists.map(checklist => checklist.title);
    if (existingTitles.includes(newChecklistTitle)) {
      toast.error("You already have a checklist with this title.", {
        position: 'top-center'
      });
      return;
    }*/

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/checklists`,
        {
          title: newChecklistTitle,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setChecklists((prev) => [...prev, response.data]);
      handleCloseModal();
      setTitleError(false); // Clear error after successful creation
      setNewChecklistTitle(""); // Reset field after successful creation

      toast.success("Checklist created successfully!", {
        position: "top-center",
      });
    } catch (err) {
      //console.log("err",err)
      if (err.status === 400) {
        const errorMessage = err.response?.data?.title?.[0] ?? err.message;
        setNewChecklistTitle(""); // Reset field after an error
        setTitleError(true);
        toast.error(errorMessage, {
          position: "top-center",
        });
      } else {
        setTitleError(false); // Clear error state for other errors
        toast.error(err.message);
      }

      //setError(errorMessage);
    }
  };

  // Handle open item modal for checklist items
  const handleOpenItemModal = (checklistId) => {
    setSelectedChecklistForItem(checklistId);
    setOpenItemModal(true);
  };

  const handleCloseItemModal = () => {
    setOpenItemModal(false);
    setNewChecklistItemText("");
  };

  // Handle create checklist items
  const handleCreateChecklistItem = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    if (!newChecklistItemText.trim()) {
      // Check if item text is empty
      //setError('Checklist item text cannot be empty.');
      setItemTextError("Checklist Item text cannot be empty!");
      return;
    }

    if (!selectedChecklistForItem) {
      //setError('Please select a checklist for this item.');
      setChecklistSelectError("Please select a checklist for this item.");

      return;
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/checklists/items`,
        {
          text: newChecklistItemText,
          checklist: selectedChecklistForItem,
          //checklist : checklistId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update checklistItems directly at the end for the selected checklist
      setChecklistItems((prevItems) => ({
        ...prevItems,
        [selectedChecklistForItem]: [
          ...(prevItems[selectedChecklistForItem] || []),
          response.data,
        ],
      }));

      handleCloseItemModal();
      setItemTextError(false);
      setChecklistSelectError(false);

      toast.success("Checklist item created successfully!", {
        position: "top-center",
      });
    } catch (err) {
      setError(err.message || "Error creating checklist item.");
      toast.error(
        "Error creating checklist item: " + (err.message || "Unknown error"),
        {
          position: "top-center",
        }
      );
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setNewItemText("");
  };

  // Function to close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewItemText("");
  };

  // Handle create checklist items for individual checklist
  const handleAddChecklistItem = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    if (!newItemText.trim()) {
      setTextError("Title can't be empty.", {
        position: "top-center",
      });
      return;
    }

    if (checklistId) {
      try {
        //console.log("Selected Id: ",checklistId)
        const response = await axios.post(
          `http://127.0.0.1:8000/api/checklists/items`,
          {
            text: newItemText,
            checklist: checklistId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const newItem = response.data; // New item from the server response

        // Update checklistItems with the new item added to the front of the list
        setChecklistItems((prevItems) => ({
          ...prevItems,
          [checklistId]: [...(prevItems[checklistId] || []), newItem],
        }));

        toast.success("Checklist item added successfully!");
        setNewItemText(""); // Clear input
        handleCloseDialog(); // Close dialog on success
      } catch (error) {
        toast.error("Failed to add checklist item.");
      }
    }
  };

  //Handle Delete checklist items for individual checklist
  const handleDeleteItem = async (checklistId, itemId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }
  
    try {
      await axios.delete(`http://127.0.0.1:8000/api/checklists/${checklistId}/items/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Update checklistItems state to remove the deleted item
      setChecklistItems((prevItems) => ({
        ...prevItems,
        [checklistId]: prevItems[checklistId].filter((item) => item.id !== itemId),
      }));
  
      toast.success("Checklist item deleted successfully!");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Unauthorized. Please log in again.");
      } else {
        toast.error("Failed to delete checklist item.");
      }
    }
  };
  
    // Open dialog when Edit icon is clicked
    const handleEditIconClick = (checklistId, item) => {
    setSelectedItemText(item.text);  // Set the item text for editing
    setCurrentChecklistId(checklistId);  // Set checklist ID
    setItemId(item.id);  // Set item ID
    setOpenEditDialog(true);  // Open the dialog
  };

  // Close dialog
  const CloseDialog = () => setOpenEditDialog(false);

  // Handle text input changes
  const handleTextChange = (e) => {
    setSelectedItemText(e.target.value);  // Update the text in the state
  };


  // Submit the updated checklist item text to the backend
  const handleUpdateItem = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }
  
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/checklists/${currentChecklistId}/items/${itemId}`,
        { text: selectedItemText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

       // Update the state if checklistItems is an object
      setChecklistItems((prevItems) => {
      if (prevItems[currentChecklistId]) {
        // Get the updated items array for the current checklist
        const updatedItems = prevItems[currentChecklistId].map(item =>
          item.id === itemId ? { ...item, text: selectedItemText } : item
        );

        return {
          ...prevItems,  // Spread the existing items
          [currentChecklistId]: updatedItems,  // Update the current checklist's items
        };
      }
      return prevItems;  // If no checklist exists, return unchanged state
    });
      toast.success("Checklist item updated successfully!", {
        position: "top-center",
      });
      CloseDialog();
    } catch (error) {
      console.error("Failed to update item:", error);
      toast.error(
        error.message || "An error occurred while updating the checklist item.",
        {
          position: "top-center",
        }
      );
    }
  };
  

  if (loading) return <LinearProgress color="secondary" />;
  if (error)
    return (
      <Typography color="error">Error fetching checklists: {error}</Typography>
    );

  const tableHeaders = [
    // For the Checkbox header
    {
      label: "",
      sx: {
        fontWeight: "bold",
        color: "text.primary",
        textAlign: "center",
        borderRight: "0.5px solid #333",
        borderBottom: "0.5px solid #333",
      },
    },
    {
      label: "#",
      sx: {
        fontWeight: "bold",
        color: "text.primary",
        textAlign: "center",
        borderRight: "0.5px solid #333",
        borderBottom: "0.5px solid #333",
      },
    },
    {
      label: "Item",
      sx: {
        fontWeight: "bold",
        color: "text.primary",
        textAlign: "center",
        borderRight: "0.5px solid #333",
        borderBottom: "0.5px solid #333",
      },
    },
    {
      label: "Updated On",
      sx: {
        fontWeight: "bold",
        color: "text.primary",
        textAlign: "center",
        borderRight: "0.5px solid #333",
        borderBottom: "0.5px solid #333",
      },
    },
    {
      label: "Actions",
      sx: {
        fontWeight: "bold",
        color: "text.primary",
        textAlign: "center",
        borderRight: "0.5px solid #333",
        borderBottom: "0.5px solid #333",
      },
    },
  ];

  
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "background.default", p: 2 }}>
        <div
          className="wrapper-class"
          style={{ display: "flex", alignContent: "stretch" }}
        >

          <Typography
            variant="h4"
            // sx={{ textAlign: 'left', color: 'text.primary', mb: 2 }}
          >
            CheckLists
          </Typography>

          <Button
            variant="contained"
            sx={{
              textTransform: "none", // Keeps the text in sentence case
              background: "linear-gradient(270deg, #3494e6, #ec6ead)", // Initial gradient
              backgroundSize: "200% 200%", // Double the background size to enable the motion effect
              marginBottom: "16px", // Adds space below the button
              color: "#000", // Change text color to suit the background
              transition: "background-position 0.5s ease", // Smooth transition for the gradient movement
              backgroundPosition: "0% 50%", // Start position of the background gradient
              "&:hover": {
                backgroundPosition: "100% 50%", // On hover, shift the background gradient
                background: "linear-gradient(270deg, #3494e6, #ec6ead)",
              },
              marginLeft: "auto", // Align the button to the right
              display: "block", // Ensure the button takes block space so marginLeft works
            }}
            onClick={handleOpenModal}
          >
            Create Checklist
          </Button>

          <Button
            variant="contained"
            sx={{
              textTransform: "none", // Keeps the text in sentence case
              background: "linear-gradient(270deg, #ec6ead,#3494e6)", // Initial gradient
              backgroundSize: "200% 200%", // Double the background size to enable the motion effect
              marginBottom: "16px", // Adds space below the button
              color: "#000", // Change text color to suit the background
              transition: "background-position 0.5s ease", // Smooth transition for the gradient movement
              backgroundPosition: "0% 50%", // Start position of the background gradient
              "&:hover": {
                backgroundPosition: "100% 50%", // On hover, shift the background gradient
                background: "linear-gradient(270deg, #3494e6, #ec6ead)",
              },
              marginLeft: "25px", // Align the button to the right
              display: "block", // Ensure the button takes block space so marginLeft works
            }}
            onClick={() => handleOpenItemModal(null)}
          >
            Create Checklist-Item
          </Button>
        </div>

        <>
          {filteredChecklists.length > 0 ? (
            filteredChecklists.map((checklist) => (
              <Accordion
                key={checklist.id}
                onChange={handleAccordionChange(checklist.id)}
                expanded={expandedAccordions.includes(checklist.id)}
                sx={{ margin: "1px 0" }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    cursor: "pointer",
                    color: "text.primary",
                    minHeight: 40,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: expandedAccordions.includes(checklist.id)
                        ? "bold"
                        : "normal",
                      fontSize: "0.9rem",
                    }}
                  >
                    {` ${checklist.title}`}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    transition: "all 0.3s ease-in-out", // Smooth transition
                    minHeight: expandedAccordions.includes(checklist.id)
                      ? "auto"
                      : "40px", // Consistent space
                    maxHeight: expandedAccordions.includes(checklist.id)
                      ? "none"
                      : "40px", // Adjust height when collapsed
                    overflow: "hidden", // Hide overflow when collapsed
                  }}
                >
                  {loadingItems[checklist.id] ? (
                    // Show skeletons when loading checklist items
                    <>
                      <Skeleton />
                      <Skeleton animation="wave" />
                      <Skeleton animation="wave" />
                      <Skeleton animation="waves" />
                    </>
                  ) : (
                    <>

                      {/* Table for checklist items */}
                      <TableContainer
                        sx={{
                          width: "80%",
                          margin: "4px auto",
                          mb: "16px",
                          tableLayout: "fixed",
                          maxHeight: 300,
                          overflowY: "auto",
                          borderBottom:
                            checklistItems[checklist.id] &&
                            checklistItems[checklist.id].length > 0
                              ? "1px solid #333"
                              : "none",
                        }}
                      >
                        {checklistItems[checklist.id] &&
                        checklistItems[checklist.id].length > 0 ? (
                          <Table
                            sx={{ bgcolor: "#eeeee", border: "1px solid #333" }}
                          >
                            <TableHead>
                              <TableRow>
                                {tableHeaders.map((header, index) => (
                                  <TableCell
                                    key={index}
                                    sx={{ padding: "4px", ...header.sx }}
                                  >
                                    {header.label}
                                  </TableCell>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody
                              sx={{
                                bgcolor: "#eeeee",
                                border: "1px solid #333",
                              }}
                            >
                              
                              {(checklistItems[checklist.id] || []).map(
                                (item, idx) => (
                                  <TableRow
                                    key={item.id}
                                    sx={{
                                      "&:hover": { backgroundColor: "#e8e8e8" },
                                    }}
                                  >
                                    <TableCell
                                      sx={{
                                        borderBottom: "1px solid #ccc",
                                        borderRight: "0.5px solid #333",
                                        textAlign: "center",
                                        padding: "4px",
                                      }}
                                    >
                                      <Checkbox
                                        checked={item.is_checked}
                                        onChange={() =>
                                          handleCheckboxChange(
                                            checklist.id,
                                            item.id
                                          )
                                        }
                                        size="small"
                                      />
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        color: "text.primary",
                                        borderBottom: "1px solid #ccc",
                                        borderRight: "0.5px solid #333",
                                        textAlign: "center",
                                      }}
                                    >
                                      {idx + 1 + ((paginationState[checklist.id]?.currentPage || 1) - 1) * 10}

                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        color: "text.primary",
                                        borderBottom: "1px solid #ccc",
                                        borderRight: "0.5px solid #333",
                                        textAlign: "center",
                                        padding: "4px",
                                      }}
                                    >
                                      <span
                                        style={{
                                          textDecoration: item.is_checked
                                            ? "line-through"
                                            : "none",
                                        }}
                                      >
                                        {item.text}
                                      </span>
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        color: "text.primary",
                                        borderBottom: "1px solid #ccc",
                                        borderRight: "0.5px solid #333",
                                        textAlign: "center",
                                        padding: "3px",
                                      }}
                                    >
                                      {new Date(
                                        item.updated_on
                                      ).toLocaleString()}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        color: "text.primary",
                                        borderBottom: "1px solid #ccc",
                                        borderRight: "0.5px solid #333",
                                        textAlign: "center",
                                        padding: "5px",

                                      }}
                                    >
                                      <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
                                        <EditIcon sx={{ cursor: "pointer" }} onClick={() => handleEditIconClick(checklist.id, item)} /> 
                                        <DeleteIcon sx={{cursor: "pointer"}} onClick={() => handleDeleteItem(checklist.id, item.id)}/>
                                      </Box>
                                    </TableCell>
                                  </TableRow>
                                )
                              )}
                            </TableBody>

                            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                            <Pagination
                              variant="outlined"
                              count={paginationState[checklist.id]?.totalPages || 1}
                              page={paginationState[checklist.id]?.currentPage || 1}
                              onChange={(event, newPage) =>
                                handleItemsPageChange(event, newPage, checklist.id)
                              }
                            />
</Box>
                          </Table>    
                        ) : (
                          <Box
                            sx={{
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              padding: 1,
                              textAlign: "center",
                              backgroundColor: "#f9f9f9",
                            }}
                          >
                            <img
                              src={noItems}
                              style={{ width: "150px", height: "auto" }}
                              alt="No items"
                            />
                            <Typography
                              variant="h6"
                              align="center"
                              sx={{ margin: 1 }}
                            >
                              No checklist items added.
                            </Typography>
                          </Box>
                        )}
                      </TableContainer>
                    </>
                  )}

                  <Button
                    variant="contained"
                    sx={{
                      textTransform: "none", // Keeps the text in sentence case
                      background: "linear-gradient(270deg, #3494e6, #ec6ead)", // Initial gradient
                      backgroundSize: "200% 200%", // Double the background size to enable the motion effect
                      marginBottom: "16px", // Adds space below the button
                      color: "#000", // Change text color to suit the background
                      transition: "background-position 0.5s ease", // Smooth transition for the gradient movement
                      backgroundPosition: "0% 50%", // Start position of the background gradient
                      "&:hover": {
                        backgroundPosition: "100% 50%", // On hover, shift the background gradient
                        background: "linear-gradient(270deg, #3494e6, #ec6ead)",
                      },

                      display: "block", // Ensure the button takes block space so marginLeft works
                      mx: "auto", // Centers the button horizontally
                      borderRadius: "20px", // Adds border-radius of 20px
                    }}
                    onClick={() => {
                      handleOpenDialog();
                      setChecklistId(checklist.id);
                    }}
                  >
                    Add Item
                  </Button>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Typography variant="h6" align="center" sx={{ margin: 2 }}>
              No checklists found for the search term.
            </Typography>
          )}
        </>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination variant="outlined"
          count={totalPages}
          page={page}
          onChange={handleChangePage}
          
        />
        </Box>
      </Box>

      {/* Checklist creation modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
      >
        <div>
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Create Checklist</Typography>

            {/* Close Icon on the right */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CloseIcon
                sx={{ cursor: "pointer" }}
                onClick={handleCloseModal}
              />
            </Box>
          </DialogTitle>

          {/* Divider */}
          <Divider sx={{ my: 0.5 }} />
        </div>

        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            padding="15px 15px"
            label="Checklist Title"
            type="text"
            fullWidth
            variant="outlined"
            value={newChecklistTitle}
            onChange={(e) => {
              setNewChecklistTitle(e.target.value);
              setTitleError(false); // Clear error when the user starts typing
            }}
            error={titleError}
            helperText={titleError ? titleError : ""}
          />
        </DialogContent>

        <div>
          <Divider sx={{ my: 0.5 }} /> {/* Divider below the text field */}
          <DialogActions sx={{ justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              onClick={handleCreateChecklist}
              color="primary"
            >
              Create
            </Button>
          </DialogActions>
        </div>
      </Dialog>

      {/* Checklist item creation modal */}
      <Dialog
        open={openItemModal}
        onClose={handleCloseItemModal}
        fullWidth
        maxWidth="sm"
      >
        <div>
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Add Checklist Item</Typography>
            <CloseIcon
              sx={{ cursor: "pointer" }}
              onClick={handleCloseItemModal}
            />
          </DialogTitle>
          <Divider sx={{ my: 0.5 }} />
        </div>

        <DialogContent>
          <TextField
            autoFocus
            label="Checklist Item"
            value={newChecklistItemText}
            onChange={(e) => {
              setNewChecklistItemText(e.target.value);
              setItemTextError(false);
            }}
            fullWidth
            error={!!itemTextError}
            helperText={itemTextError}
          />

          <TextField
            select
            label="Select Checklist"
            value={selectedChecklistForItem}
            onChange={(e) => {
              setSelectedChecklistForItem(e.target.value);
              setChecklistSelectError(false);
            }}
            fullWidth
            sx={{ mt: 2 }}
            error={!!checklistSelectError}
            helperText={checklistSelectError}
          >
           {Array.isArray(checklists) && checklists.length > 0 ? (
              checklists.map((checklist) => (
                <MenuItem key={checklist.id} value={checklist.id}>
                  {checklist.title}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No Checklists Available</MenuItem>
            )}
          </TextField>
        </DialogContent>

        <Divider sx={{ my: 0.5 }} />

        <DialogActions sx={{ justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            onClick={handleCreateChecklistItem}
            color="primary"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Individual Checklist item creation modal */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <div>
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Add Checklist Item</Typography>
            <CloseIcon sx={{ cursor: "pointer" }} onClick={handleCloseDialog} />
          </DialogTitle>
          <Divider sx={{ my: 0.5 }} />
        </div>

        <DialogContent>
          <TextField
            autoFocus
            label="Checklist Item"
            value={newItemText}
            onChange={(e) => {
              setNewItemText(e.target.value);
              setTextError(false);
            }}
            fullWidth
            error={!!TextError} // Shows red underline if error exists
            helperText={TextError} // Shows error message below the TextField
          />
        </DialogContent>

        <Divider sx={{ my: 0.5 }} />

        <DialogActions sx={{ justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            onClick={handleAddChecklistItem}
            color="primary"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={CloseDialog}  fullWidth maxWidth="sm">
      <div>
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Update Checklist Item</Typography>
            <CloseIcon sx={{ cursor: "pointer" }} onClick={CloseDialog} />
          </DialogTitle>
          <Divider sx={{ my: 0.5 }} />
        </div>

        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Text"
            value={selectedItemText}  // Bind the text input to the state
            onChange={handleTextChange}  // Update the state on text change
          />
        </DialogContent>
        <Divider sx={{ my: 0.5 }} />

        <DialogActions sx={{ justifyContent: "flex-end" }}>
          <Button variant="contained" onClick={handleUpdateItem}  color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
      {/* Pagination component */}
        
    </ThemeProvider>
  );
};

export default Checklists;
