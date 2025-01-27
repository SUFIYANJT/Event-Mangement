import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BookingDetails = () => {
  const [increment, setIncrement] = useState(1); // Default 1 person
  const [names, setNames] = useState<string[]>([]);
  const [ages, setAges] = useState<number[]>([]);
  const [emails, setEmails] = useState<string[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string>(''); // Single phone number for all
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar open state
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'success'>('error'); // Error or Success message severity
  const navigate = useNavigate();

  const handleIncrementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newIncrement = parseInt(e.target.value);
    if (newIncrement > 4) newIncrement = 4; // Restrict max to 4
    if (newIncrement < 1) newIncrement = 1; // Restrict min to 1
    setIncrement(newIncrement);

    // Adjust the names and ages array based on the increment value
    const updatedNames = Array(newIncrement).fill('');
    const updatedAges = Array(newIncrement).fill(0);
    const updatedEmails = Array(newIncrement).fill('');
    setNames(updatedNames);
    setAges(updatedAges);
    setEmails(updatedEmails);
  };

  const handleNameChange = (index: number, value: string) => {
    const updatedNames = [...names];
    updatedNames[index] = value;
    setNames(updatedNames);
  };

  const handleAgeChange = (index: number, value: number) => {
    const updatedAges = [...ages];
    updatedAges[index] = value;
    setAges(updatedAges);
  };

  const handleEmailChange = (index: number, value: string) => {
    const updatedEmails = [...emails];
    updatedEmails[index] = value;
    setEmails(updatedEmails);
  };

  const handlePhoneNumberChange = (value: string) => {
    setPhoneNumber(value);
  };

  const handleConfirmTicket = () => {
    // Check if Name and Age are filled in for all participants
    const allNamesFilled = names.every((name) => name.trim() !== '');
    const allAgesFilled = ages.every((age) => age > 0);

    // If Name or Age is missing, show Snackbar with an error message
    if (!allNamesFilled || !allAgesFilled) {
      setSnackbarMessage("Please fill in all Name and Age fields.");
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    // If phone number is not provided, show Snackbar with an error message
    if (!phoneNumber.trim()) {
      setSnackbarMessage("Please provide a phone number.");
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    // Navigate to the TicketConfirmation page and pass the details
    navigate('/ticket-confirmation', { state: { names, emails, phoneNumber, ages, increment } });
  };

  // Close the snackbar after a few seconds
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box className="payment-form-container" sx={{ width: '100%', maxWidth: 600, margin: '0 auto', padding: 3, backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Booking Details
      </Typography>

      <Box className="form-group" sx={{ marginBottom: 3 }}>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>
          Number of people (Max 4):
        </Typography>
        <TextField
          type="number"
          value={increment}
          min="1"
          max="4"
          onChange={handleIncrementChange}
          fullWidth
          variant="outlined"
          size="small"
          sx={{ marginBottom: 2 }}
        />
      </Box>

      {/* Collect Name, Age, and Email for each participant */}
      {Array.from({ length: increment }).map((_, index) => (
        <Box key={index} sx={{ marginBottom: 3, padding: 2, backgroundColor: '#f1f1f1', borderRadius: 2 }}>
          <TextField
            label={`Name`}
            value={names[index]}
            onChange={(e) => handleNameChange(index, e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label={`Age`}
            type="number"
            value={ages[index]}
            onChange={(e) => handleAgeChange(index, parseInt(e.target.value))}
            fullWidth
            variant="outlined"
            size="small"
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label={`Email`}
            type="email"
            value={emails[index]}
            onChange={(e) => handleEmailChange(index, e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            sx={{ marginBottom: 2 }}
          />
        </Box>
      ))}

      {/* Single phone number input for all participants */}
      <Box className="form-group" sx={{ marginBottom: 3 }}>
        <TextField
          label="Phone Number"
          value={phoneNumber}
          onChange={(e) => handlePhoneNumberChange(e.target.value)}
          fullWidth
          variant="outlined"
          size="small"
          required
          sx={{ marginBottom: 2 }}
        />
      </Box>

      <Button
        onClick={handleConfirmTicket}
        variant="contained"
        color="success"
        fullWidth
        sx={{ padding: '10px', fontSize: '1rem', fontWeight: 'bold', marginTop: 2 }}
      >
        Confirm Ticket
      </Button>

      {/* Snackbar for feedback */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BookingDetails;
