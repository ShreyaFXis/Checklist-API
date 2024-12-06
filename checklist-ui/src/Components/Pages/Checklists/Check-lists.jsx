import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import {
  Accordion, AccordionSummary, AccordionDetails, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Checkbox, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Divider, Skeleton,  
  LinearProgress, Pagination, IconButton, 
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
  const [item, setItem] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedItemText, setSelectedItemText] = useState('');  // Store the item text only
  const [currentChecklistId, setCurrentChecklistId] = useState(null);  // Store checklist ID
  const [itemId, setItemId] = useState(null); // Store item ID  
  // Pagination state
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10); // Adjust items per page as needed

  const [totalPages, setTotalPages] = useState(0);
  const [paginationState, setPaginationState] = useState({}); // Manage pagination per checklist
  //console.log(paginationState)

  const [searchParams] = useSearchParams(); // Get URL search params
  const searchTerm = searchParams.get("search")?.toLowerCase() || ""; // Get search term and convert to lowercase

  const [openModal, setOpenModal] = useState(false);
  const [newChecklistTitle, setNewChecklistTitle] = useState("");

  //Multiple delete
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedChecklists, setSelectedChecklists] = React.useState([]);
    // Pagination state and logic
  const [currentPage, setCurrentPage] = React.useState(1);

  // handle the edit button
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setSelectedChecklists([]);
  };

  // handle checkbox selection for checklists
  const handleChecklistSelection = (checklistId) => {
    setSelectedChecklists((prevSelected) =>
      prevSelected.includes(checklistId)
        ? prevSelected.filter((id) => id !== checklistId) // Remove if already selected
        : [...prevSelected, checklistId] // Add if not selected
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedChecklists.length === 0) {
      alert("No checklists selected for deletion.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found. Please log in.");
        return;
      }
      //console.log("token :: ", token);
  
      
      const response = await axios.delete(`http://127.0.0.1:8000/api/checklists`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { checklist_ids: selectedChecklists }, 
      });
  

      if (response.status === 200) {
        setFilteredChecklists((prevFilteredChecklists) => {
          const updatedChecklists = prevFilteredChecklists.filter(
            (checklist) => !selectedChecklists.includes(checklist.id)
          );
  
          const totalRemainingItems = updatedChecklists.length;
  
          // Calculate total pages
          const totalPages = Math.ceil(totalRemainingItems / itemsPerPage);
  
          // Check if the current page is now empty
          const startIndex = (page - 1) * itemsPerPage;
          const currentPageItems = updatedChecklists.slice(startIndex, startIndex + itemsPerPage);
  
          if (currentPageItems.length === 0) {
            // Move to the last valid page if items remain
            if (totalRemainingItems > 0) {
              setPage((prevPage) => Math.min(prevPage, totalPages));
            } else {
              setPage(1); // Redirect to Page 1 if no items are left
            }
          }
  
          return updatedChecklists;
        });
  
        setSelectedChecklists([]); // Clear selected items
        toast.success(response.data.message || "Checklists deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting checklists:", error);
      toast.error(error.response?.data?.error || "Failed to delete checklists.");
    }
  };
// Paginate checklists
const paginatedChecklists = React.useMemo(() => {
  const startIndex = (page - 1) * itemsPerPage;
  return filteredChecklists.slice(startIndex, startIndex + itemsPerPage);
}, [filteredChecklists, page]);

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
          headers: { Authorization: `Bearer ${token}`},
        }
      );
  
      const page_count=Math.ceil(response.data.count / 10)

      // If the requested page is out of range, fetch the last available page
    if (page > page_count && page_count > 0) {
      await fetchChecklistItems(checklistId, page_count);
      return;
    }

      // Update items and pagination state
      setChecklistItems((prevItems) => ({
        ...prevItems,
        [checklistId]: response.data.results,
      }));
      
     // console.log("response.data.count:: ",response.data.count)

   
    setPaginationState((prevState) => ({
        ...prevState,
        [checklistId]: {
          currentPage: page,
          totalPages: page_count || 1,
        },
      })); 
      //console.log("item totalPages  : ",totalPages)

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
   // console.log(`Fetching page ${newPage} for checklist ${checklistId}`); // Debug log
    await fetchChecklistItems(checklistId, newPage); // Fetch data directly for the new page
  };
  

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

  // UseEffect for fetching checklists
  useEffect(() => {
    fetchChecklists();
  }, [page]); // Only when `page` changes

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
  
    try {
      const newIsChecked = !item.is_checked; 
      
      //console.log(`Toggling checkbox for item ${itemId} to ${newIsChecked}`);
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/checklists/${checklistId}/items/${itemId}`,
        { is_checked: newIsChecked }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      

      // Revert the optimistic update on error
      setChecklistItems((prevItems) => {
        const revertedItems = prevItems[checklistId].map((item) =>
          item.id === itemId ? { ...item, is_checked: !item.is_checked } : item
        );
        return { ...prevItems, [checklistId]: revertedItems };
      });


    } catch (error) {
      console.error("Error updating checkbox:", error);
      toast.error(
        error.response?.data?.error || "Failed to update checkbox."
      );
    }
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

      handleCloseModal();
      setTitleError(false); // Clear error after successful creation
      setNewChecklistTitle(""); // Reset field after successful creation

      toast.success("Checklist created successfully!", {
        position: "top-center",
      });

       // Refetch data for the current page
       const updatedResponse = await axios.get(
        `http://127.0.0.1:8000/api/checklists?page=${page}&titles_only=true`,
        { headers: { Authorization: `Bearer ${token}` } }
    );

    setChecklists(updatedResponse.data.results || []);
    setTotalPages(Math.ceil(updatedResponse.data.count / itemsPerPage));

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
      // setChecklistItems((prevItems) => ({
      //   ...prevItems,
      //   [selectedChecklistForItem]: [
      //     ...(prevItems[selectedChecklistForItem] || []),
      //     response.data,
      //   ],
      // }));

       // Refetch the updated checklist items
       await fetchChecklistItems(selectedChecklistForItem, 1); // Refetch the first page of items


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

         // Refetch items for the current checklist
      const { currentPage } = paginationState[checklistId] || { currentPage: 1 };
      await fetchChecklistItems(checklistId, currentPage);

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
     const response = await axios.delete(`http://127.0.0.1:8000/api/checklists/${checklistId}/items/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
    toast.success("Checklist item deleted successfully!");

     // Handle pagination state
     const itemsPerPage = 10;
     const { currentPage = 1, totalPages = 1, totalCount = 0 } = paginationState[checklistId] || {};
 
     // Update total count after deletion
     const newTotalCount = totalCount - 1;
     //console.log("newTotalCount :: ", newTotalCount)

     // Recalculate total pages
     const newTotalPages = Math.ceil(newTotalCount / itemsPerPage);
    //console.log("newTotalPages :: ", newTotalPages)

     // Determine the new page
     const newPage = newTotalCount <= itemsPerPage
       ? 1 
       : (newTotalCount % itemsPerPage === 0 && currentPage > 1) ? currentPage - 1 : currentPage;
     
      // console.log(currentPage, newPage)

     // Update pagination state
     setPaginationState((prevState) => ({
       ...prevState,
       [checklistId]: {
         currentPage: newPage,
         totalPages: newTotalPages || 1, 
         totalCount: newTotalCount,
       },
     }));
 
     // Refetch items
     await fetchChecklistItems(checklistId, newPage);
 
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
          style={{ display: "flex" ,alignContent: "strech", alignItems:"center" }}
        >

      <EditIcon
        style={{ cursor: "pointer" }}
        onClick={toggleEditMode}
      />

        {isEditMode && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            marginRight:"6px",
            marginLeft:"15px"
          }}
        >

          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            sx={{ textTransform: "none", marginRight: "10px", position: "relative" }}
            onClick={handleDeleteSelected}
          >
            Delete
            {selectedChecklists.length > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  backgroundColor: "red",
                  color: "white",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                }}
              >
                {selectedChecklists.length}
              </Box>
            )}
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCancel}
            sx={{
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
        </div>
      )}

          <div  style={{
            display: "flex",
            flexDirection: "row", 
            alignItems: "flex-end", 
            marginLeft: "auto",
          }}>

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
        </div>

        <>
        
          {filteredChecklists.length > 0 ? (
            filteredChecklists.map((checklist) => (
              <div key={checklist.id} style={{ marginBottom: "0",display:"flex", flexDirection: "row"}}>
                {/* Checkbox placed outside the Accordion */}
                {isEditMode && (
                  <Checkbox 
                    size="small" 
                    sx={{ marginRight: 1, flexDirection: "row"}}
                    checked={selectedChecklists.includes(checklist.id)}
                    onChange={() => handleChecklistSelection(checklist.id)} 
                  />
                )}
                <Accordion
                key={checklist.id}
                onChange={handleAccordionChange(checklist.id)}
                expanded={expandedAccordions.includes(checklist.id)}
                sx={{ margin: "1px 0", width: "100%" }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    cursor: "pointer",
                    color: "text.primary",
                    minHeight: 15,
                    margin : "0"
                  }}
                >
      
                  <Typography
                    sx={{
                      fontWeight: expandedAccordions.includes(checklist.id)
                        ? "bold"
                        : "normal",
                      fontSize: "0.9 rem",
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
                    margin: '6px'
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
                          //maxHeight: 350,
                        //  overflowY: "auto",
                          border: checklistItems[checklist.id] && checklistItems[checklist.id].length > 0
                                    ? "1px solid #333" // Border when items are present
                                    : "none", // No border when no items
                          }}
                      >
                        {checklistItems[checklist.id] &&
                        checklistItems[checklist.id].length > 0 ? (
                          <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            height: "100%", // Space between table and pagination
                          }}>
                             
                           <Box
                           sx={{
                            flex: "1 1 auto",
                            overflowY: "auto",
                            maxHeight: 350, // Scrollbar only for the table content
                          }}
                           >
                             <Table  stickyHeader aria-label="sticky table"
                              sx={{ bgcolor: "#eeeee", borderCollapse: "collapse" }}
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
                                          onChange={() => {
                                            setItem((prevItem) => ({ ...prevItem, is_checked: !prevItem.is_checked }));
                                            handleCheckboxChange(checklist.id, item.id);
                                          }}
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
                            </Table>
                           </Box>


                              <Box
                              sx={{
                                position: "sticky", // Makes the element sticky
                                bottom: 0, // Sticks at the bottom of the scrollable container
                                backgroundColor: "#fff", // Ensure it has a background color to cover content
                                zIndex: 1, // Ensures it stays above the table
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: "8px",
                                borderTop: "1px solid #ccc", // Optional: Adds a top border for better visibility
                                }}>
                                <Pagination
                                  variant="outlined"
                                  count={paginationState[checklist.id]?.totalPages || 1}
                                  page={paginationState[checklist.id]?.currentPage || 1}
                                  onChange={(event, newPage) =>
                                    handleItemsPageChange(event, newPage, checklist.id)
                                  }
                                />
                              </Box>
                          </Box>
                          
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
              </div>
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