import React, { useEffect, useState } from 'react';
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
import DeleteIcon from '@mui/icons-material/Delete';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";

interface EventDetails {
  id?: string;
  name: string;
  description: string;
  slots: string;
  image: File | null;
  created_at: string | null;
  created_by: string | null;
}

const Organizer: React.FC = () => {
  const navigator = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [eventDetails, setEventDetails] = useState<EventDetails>({
    name: '',
    description: '',
    slots: '',
    image: null,
    created_at: '',
    created_by: '',
  });

  const [events, setEvents] = useState<EventDetails[]>([]);
  const [selectedDateTime, setSelectedDateTime] = useState<Dayjs | null>(dayjs());

  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch Events
  const fetchEvents = async () => {
    if (!localStorage.getItem("user") || !localStorage.getItem("token")) {
      navigator("/login");
      return;
    }
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    try {
      const response = await axios.post('http://127.0.0.1:3000/eventOrganizer', { id: user.id }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(response.data.message)) {
        setEvents(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // Handle Input Change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Date Change
  const handleDateChange = (newValue: Dayjs | null) => {
    setSelectedDateTime(newValue);
  };

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setEventDetails((prev) => ({ ...prev, image: files[0] }));
    }
  };

  // Handle Event Submission
  const handleDone = async () => {
    const formData = new FormData();
    formData.append('name', eventDetails.name);
    formData.append('description', eventDetails.description);
    formData.append('slots', eventDetails.slots);

    if (selectedDateTime) {
      formData.append('eventdate', dayjs(selectedDateTime).format('YYYY-MM-DD'));
    } else {
      alert("Date is not selected");
      return;
    }

    if (eventDetails.image instanceof File) {
      formData.append("file", eventDetails.image);
    } else {
      alert("Invalid file type.");
      return;
    }

    const user = localStorage.getItem('user');
    if (user) {
      formData.append('user', user);
    } else {
      alert("Invalid user credential");
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post('http://127.0.0.1:3000/eventCreation', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(`Event "${response.data.message.name}" created!`);
      setDrawerOpen(false);
      
      const newEvent: EventDetails = {
        id: response.data.message.id,
        name: response.data.message.name,
        description: response.data.message.description,
        slots: response.data.message.slots,
        image: response.data.message.image,
        created_at: response.data.message.created_at,
        created_by: response.data.message.created_by,
      };

      setEvents((prev) => [...prev, newEvent]);
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Error creating event');
    }
  };

  // Handle Event Deletion
  const handleDeleteEvent = async (eventId?: string) => {
    if (!eventId) return;

    const token = localStorage.getItem('token');
    
    try {
      await axios.delete(`http://127.0.0.1:3000/eventDelete/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Event deleted successfully!");
      setEvents((prev) => prev.filter(event => event.id !== eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Error deleting event.");
    }
  };

  return (
    <div>
      {/* AppBar */}
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Eventify
          </Typography>
          <IconButton component={Link} to="/Profile" color="inherit">
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setDrawerOpen(true)}
      >
        <AddIcon />
      </Fab>

      {/* Drawer for Adding Events */}
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ '& .MuiDrawer-paper': { padding: 3, borderRadius: '12px 12px 0 0' } }}
      >
        <Typography variant="h6">Add Event Details</Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Event Name" name="name" value={eventDetails.name} onChange={handleInputChange} fullWidth />
          <TextField label="Description" name="description" value={eventDetails.description} onChange={handleInputChange} fullWidth multiline rows={3} />
          <TextField label="Available Slots" name="slots" value={eventDetails.slots} onChange={handleInputChange} fullWidth />
          
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker label="Select Date & Time" value={selectedDateTime} onChange={handleDateChange} />
          </LocalizationProvider>
          
          <Button variant="outlined" component="label">
            Upload Image
            <input type="file" hidden onChange={handleImageUpload} />
          </Button>

          <Button variant="contained" color="primary" onClick={handleDone}>
            Done
          </Button>
        </Box>
      </Drawer>

      {/* Event List with Delete Button */}
      {events.map((event) => (
        <Box key={event.id} sx={{ margin: 3, padding: 3, border: '1px solid #ddd', borderRadius: 2 }}>
          <Typography variant="h6">{event.name}</Typography>
          <Typography><strong>Description:</strong> {event.description}</Typography>
          <Typography><strong>Slots:</strong> {event.slots}</Typography>
          <Button variant="contained" color="secondary" startIcon={<DeleteIcon />} onClick={() => handleDeleteEvent(event.id)}>
            Delete
          </Button>
        </Box>
      ))}
    </div>
  );
};

export default Organizer;
