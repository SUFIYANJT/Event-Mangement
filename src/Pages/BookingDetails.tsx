import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BookingDetails = () => {
  const [increment, setIncrement] = useState(1); // Default 1 person
  const [names, setNames] = useState<string[]>([]);
  const [ages, setAges] = useState<number[]>([]);
  const [emails, setEmails] = useState<string[]>([]);
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleIncrementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIncrement = parseInt(e.target.value);
    setIncrement(newIncrement);

    // Adjust the names and ages array based on the increment value
    const updatedNames = Array(newIncrement).fill('');
    const updatedAges = Array(newIncrement).fill(0);
    const updatedEmail = Array(newIncrement).fill('');
    setNames(updatedNames);
    setAges(updatedAges);
    setEmails(Array(newIncrement).fill(''));
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
  const handleEmailsChange = (index: number, value: string) => {
    const updatedEmails = [...emails];
    updatedEmails[index] = value;
    setEmails(updatedEmails);
  };
  const handlePhoneNumberChange = (index: number, value: string) => {
    const updatedPhoneNumbers = [...phoneNumbers];
    updatedPhoneNumbers[index] = value;
    setPhoneNumbers(updatedPhoneNumbers);
  };
  const handleConfirmTicket = () => {
    // Navigate to the TicketConfirmation page and pass the details
    navigate('/ticket-confirmation', { state: { names, emails,phoneNumbers,ages, increment } });
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
          <TextField
            label={`Email `}
            type="email"
            value={emails[index]}
            onChange={(e: { target: { value: string; }; }) => handleEmailsChange(index, e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            sx={{ marginBottom: 2 }}
            
          />
           <TextField
            label={`Phone Number `}
            type="text"
            value={phoneNumbers[index]}
            onChange={(e: { target: { value: string; }; }) => handlePhoneNumberChange(index, e.target.value)}
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
function setEmails(arg0: any[]) {
  throw new Error('Function not implemented.');
}

