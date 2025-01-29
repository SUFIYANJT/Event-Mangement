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
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";

interface EventDetails {
  name: string;
  description: string;
  slots: string;
  image: File | null;
  created_at: string | null,
  created_by: string | null
}


const Organizer: React.FC = () => {
  const navigator = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [eventDetails, setEventDetails] = useState<EventDetails>({
    name: '',
    description: '',
    slots: '',
    image: null,
    created_at: '',
    created_by: ''
  });
  var condition = true

  const fetchEvent = async () => {
    condition = false
    const formData = new FormData()
    if (localStorage.getItem("user") != null && localStorage.getItem('token') != null) {
      var str = localStorage.getItem("user")
      const user = JSON.parse(str != null ? str : "")
      formData.append('id', user["id"])
    } else {
      navigator("/login")
      return
    }
    const token = localStorage.getItem('token')
    try {
      const response = await axios.post('http://127.0.0.1:3000/eventOrganizer', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      });
      setSubmittedDetails(eventDetails);
      setDrawerOpen(false); // Close the drawer
      console.log(response.data)
      if (response.data.message instanceof Array) {

        response.data.message.map((element: any) => {
          const newElement: EventDetails = {
            name: element.name,
            description: element.description,
            slots: element.slots,
            image: element.image,
            created_at: element.created_at,
            created_by: element.created_by
          }
          SetEvent((prev) => [...prev, newElement])
        })
      }

    } catch (error) {
      console.error('Error creating event:', error);
      alert('Error creating event');
    }

  }

  const [submittedDetails, setSubmittedDetails] = useState<EventDetails | null>(null);

  // Input Change Handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventDetails((prev) => ({ ...prev, [name]: value }));
  };
  const [selectedDateTime, setSelectedDateTime] = useState<Dayjs | null>(dayjs());
  const [events, SetEvent] = useState<EventDetails[]>([])
  const [eventViews, setEventViews] = useState<React.ReactNode[]>([]);
  useEffect(() => {
    console.log(events.length);
    fetchEvent()
  }, [])

  useEffect(() => {
    console.log(events.length,condition);
    setEventViews([])
    events.map((element) => {
      setEventViews((prev) => [...prev, (<Box sx={{ margin: 3, padding: 3, border: '1px solid #ddd', borderRadius: 2 }}>
        <Typography variant="h6">Event Details</Typography>
        <Typography variant="body1">
          <strong>Name:</strong> {element.name}
        </Typography>
        <Typography variant="body1">
          <strong>Description:</strong> {element.description}
        </Typography>
        <Typography variant="body1">
          <strong>Available Slots:</strong> {element.slots}
        </Typography>
        {element.image && (
          <Typography variant="body1">
            <strong>Uploaded Image:</strong> {element.image.name}
          </Typography>
        )}
      </Box>)])
    })
  }, [events])

  const handleDateChange = (newValue: Dayjs | null) => {
    console.log(newValue);
    setSelectedDateTime(newValue);
  };

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; // Extract files safely
    if (files && files.length > 0) {
      setEventDetails((prev) => ({ ...prev, image: files[0] }));
    }
  };

  // Combined Done Button Handler
  const handleDone = async () => {
    const formData = new FormData();
    formData.append('name', eventDetails.name);
    formData.append('description', eventDetails.description);
    formData.append('slots', eventDetails.slots);
    if (selectedDateTime != null) {
      const formattedDate = dayjs(selectedDateTime).format('YYYY-MM-DD')
      console.log(formattedDate)
      formData.append('eventdate', formattedDate.toString());
    } else {
      alert("date is not picked...")
      return
    }
    if (eventDetails.image instanceof File) {
      formData.append("file", eventDetails.image);
    } else {
      alert("Invalid file type.");
      return;
    }
    const user = localStorage.getItem('user')
    if (user != null)
      formData.append('user', user)
    else {
      alert("Invalid user credential")
      return
    }
    const token = localStorage.getItem('token')
    console.log(formData.get('eventdate'))
    try {
      const response = await axios.post('http://127.0.0.1:3000/eventCreation', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      });
      setSubmittedDetails(eventDetails);
      setDrawerOpen(false); // Close the drawer
      alert("event " + response.data.message.name + " has created"); // Show success message
      console.log(response.data)
      const newElement: EventDetails = {
        name: response.data.message.name,
        description: response.data.message.description,
        slots: response.data.message.slots,
        image: response.data.message.image,
        created_at: response.data.message.created_at,
        created_by: response.data.message.created_by
      }
      SetEvent((prev) => [...prev, newElement])
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Error creating event');
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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Select Date & Time"
              value={selectedDateTime}
              onChange={handleDateChange}

            />
          </LocalizationProvider>
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
      {submittedDetails && eventViews}
    </div>
  );
};

export default Organizer;