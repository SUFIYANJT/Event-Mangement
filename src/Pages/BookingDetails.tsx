import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BookingDetails = () => {
  const [increment, setIncrement] = useState(1); // Default 1 person
  const [names, setNames] = useState<string[]>([]);
  const [ages, setAges] = useState<number[]>([]);
  
  const navigate = useNavigate();

  const handleIncrementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIncrement = parseInt(e.target.value);
    setIncrement(newIncrement);

    // Adjust the names and ages array based on the increment value
    const updatedNames = Array(newIncrement).fill('');
    const updatedAges = Array(newIncrement).fill(0);
    setNames(updatedNames);
    setAges(updatedAges);
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

  const handleConfirmTicket = () => {
    // Navigate to the TicketConfirmation page and pass the details
    navigate('/ticket-confirmation', { state: { names, ages, increment } });
  };

  return (
    <Box className="payment-form-container" sx={{ width: '100%', maxWidth: 600, margin: '0 auto', padding: 3, backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Booking Details
      </Typography>

      <Box className="form-group" sx={{ marginBottom: 3 }}>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>
          Number of people:
        </Typography>
        <TextField
          type="number"
          value={increment}
          min="1"
          onChange={handleIncrementChange}
          fullWidth
          variant="outlined"
          size="small"
          sx={{ marginBottom: 2 }}
        />
      </Box>

      {Array.from({ length: increment }).map((_, index) => (
        <Box key={index} sx={{ marginBottom: 3, padding: 2, backgroundColor: '#f1f1f1', borderRadius: 2 }}>
          <TextField
            label={`Name`}
            value={names[index]}
            onChange={(e: { target: { value: string; }; }) => handleNameChange(index, e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label={`Age `}
            type="number"
            value={ages[index]}
            onChange={(e: { target: { value: string; }; }) => handleAgeChange(index, parseInt(e.target.value))}
            fullWidth
            variant="outlined"
            size="small"
            sx={{ marginBottom: 2 }}
          />
        </Box>
      ))}

      <Button
        onClick={handleConfirmTicket}
        variant="contained"
        color="success"
        fullWidth
        sx={{ padding: '10px', fontSize: '1rem', fontWeight: 'bold', marginTop: 2 }}
      >
        Confirm Ticket
      </Button>
    </Box>
  );
};

export default BookingDetails;
