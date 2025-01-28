import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Fab,
  Drawer,
  TextField,
  Button,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';
import { Link, useNavigate } from 'react-router-dom';

interface EventDetails {
  name: string;
  description: string;
  slots: string;
  image: File | null;
}

const Organizer: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [eventDetails, setEventDetails] = useState<EventDetails>({
    name: '',
    description: '',
    slots: '',
    image: null,
  });
  const navigator = useNavigate()

  const [submittedDetails, setSubmittedDetails] = useState<EventDetails | null>(null);

  // Input Change Handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; // Extract files safely
    if (files && files.length > 0) {
      setEventDetails((prev) => ({ ...prev, image: files[0] }));
    }
  };

  // Done Button Handler
  const handleDone = () => {
    setSubmittedDetails(eventDetails);
    setDrawerOpen(false); // Close the drawer
  };

  return (
    <div>
      {/* AppBar */}
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Eventify
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton component={Link} to="/Profile" color="inherit">
              <AccountCircleIcon />
            </IconButton>
          </Box>
          <Button onClick={(eve:React.FormEvent)=>{
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            navigator("/")
          }}>
            logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={() => setDrawerOpen(true)}
      >
        <AddIcon />
      </Fab>

      {/* Drawer */}
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            padding: 3,
            borderRadius: '12px 12px 0 0', // Rounded corners for top
          },
        }}
      >
        <Typography variant="h6" gutterBottom>
          Add Event Details
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Event Name"
            name="name"
            value={eventDetails.name}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Description"
            name="description"
            value={eventDetails.description}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={3}
          />
          <TextField
            label="Available Slots"
            name="slots"
            value={eventDetails.slots}
            onChange={handleInputChange}
            fullWidth
          />
          <Button variant="outlined" component="label">
            Upload Image
            <input type="file" hidden onChange={handleImageUpload} />
          </Button>
          {eventDetails.image && (
            <Typography variant="body2" color="textSecondary">
              {eventDetails.image.name}
            </Typography>
          )}
          <Button variant="contained" color="primary" onClick={handleDone}>
            Done
          </Button>
        </Box>
      </Drawer>

      {/* Submitted Details Display */}
      {submittedDetails && (
        <Box sx={{ margin: 3, padding: 3, border: '1px solid #ddd', borderRadius: 2 }}>
          <Typography variant="h6">Event Details</Typography>
          <Typography variant="body1">
            <strong>Name:</strong> {submittedDetails.name}
          </Typography>
          <Typography variant="body1">
            <strong>Description:</strong> {submittedDetails.description}
          </Typography>
          <Typography variant="body1">
            <strong>Available Slots:</strong> {submittedDetails.slots}
          </Typography>
          {submittedDetails.image && (
            <Typography variant="body1">
              <strong>Uploaded Image:</strong> {submittedDetails.image.name}
            </Typography>
          )}
        </Box>
      )}
    </div>
  );
};

export default Organizer;
