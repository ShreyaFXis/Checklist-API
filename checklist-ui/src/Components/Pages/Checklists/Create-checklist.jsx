import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Correctly import useNavigate
import { toast } from 'react-toastify';  // Remove ToastContainer here
import 'react-toastify/dist/ReactToastify.css';
import AuthLayout from '../../Layouts/AuthLayout';  // Import AuthLayout

const CreateChecklist = () => {
  const [title, setTitle] = useState('');
  const navigate = useNavigate();  // Use useNavigate hook

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Send POST request to create new checklist
      await axios.post('http://localhost:8000/api/checklists', { title }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,  // Use JWT token
        },
      });

      toast.success('Checklist created successfully!');
      setTimeout(() => {
        navigate('/checklists'); // Redirect after successful creation
      }, 2000);  
    } catch (error) {
      toast.error('Failed to create checklist.');
    }
  };

  return (
    <>
      <Typography
        variant="h4"
        color="#1a1713"
        sx={{
          fontFamily: 'Roboto',
          textAlign: 'center',
          mb: 2,
        }}
      >
        Create New Checklist
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            alignItems: 'center',
            width: '100%',
          }}
        >
          <TextField
            required
            color="primary"
            id="title"
            label="Checklist Title"
            placeholder="Enter checklist title"
            sx={{ width: '100%', minWidth: '250px' }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Button variant="contained" type="submit" sx={{ mt: 2 }}>
            Create Checklist
          </Button>
        </Box>
      </form>
    </>
  );
};

export default CreateChecklist;
