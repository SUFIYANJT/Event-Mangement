import React, { useState, ReactNode } from 'react';
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
  Skeleton,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import '../Static/Organizer.css';
interface EventDetails {
  Tag: ReactNode;
  Location: ReactNode; // Fixed typo: changed 'Loaction' to 'Location'
  name: string;
  description: string;
  slots: string;
  image: File | null;
  date: string;
}

const Organizer: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [eventDetails, setEventDetails] = useState<EventDetails>({
    Tag: '',
    Location: '',
    name: '',
    description: '',
    slots: '',
    image: null,
    date: '',
  });

  const [submittedDetails, setSubmittedDetails] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Input Change Handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setEventDetails((prev) => ({ ...prev, image: files[0] }));
    }
  };

  // Date Change Handler
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEventDetails((prev) => ({ ...prev, date: value }));
  };

  // Done Button Handler
  const handleDone = () => {
    setLoading(true);
    setSubmittedDetails(eventDetails);
    setDrawerOpen(false);

    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  // Format the time to a more readable format (HH:mm)
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`;
  };

  return (
    <div>
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
            borderRadius: '12px 12px 0 0',
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
          <TextField
            label="Event Date & Time"
            type="datetime-local"
            name="date"
            value={eventDetails.date}
            onChange={handleDateChange}
            fullWidth
          />
          <TextField
            label="Tag"
            name="Tag"
            value={eventDetails.Tag}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Location"
            name="Location"
            value={eventDetails.Location}
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
          <Button
            variant="contained"
            color="primary"
            onClick={handleDone}
          >
            Done
          </Button>
        </Box>
      </Drawer>

      {/* Submitted Details Display */}
      {loading ? (
        <Skeleton variant="rectangular" width="100%" height={200} />
      ) : (
        submittedDetails && (
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
            <Typography variant="body1">
              <strong>Location:</strong> {submittedDetails.Location}
            </Typography>
            <Typography variant="body1">
              <strong>Tag:</strong> {submittedDetails.Tag}
            </Typography>
            <Typography variant="body1">
              <strong>Event Date:</strong> {submittedDetails.date}
            </Typography>
            <Typography variant="body1">
              <strong>Event Time:</strong> {formatTime(submittedDetails.date)}
            </Typography>
            {submittedDetails.image && (
              <Typography variant="body1">
                <strong>Uploaded Image:</strong> {submittedDetails.image.name}
              </Typography>
            )}
          </Box>
        )
      )}
    </div>
  );
};

export default Organizer;
