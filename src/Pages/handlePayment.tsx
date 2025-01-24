import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const TicketConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { names, ages, increment } = location.state || {};

  const handlePayment = async () => {
    // Call your backend to create an order and get the Razorpay order ID.
    // For demo purposes, we're using a fixed amount and a demo API URL.

    const response = await fetch('https://your-backend.com/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 5000, // Example amount in paise (5000 paise = 50 INR)
        currency: 'INR',
      }),
    });

    const data = await response.json();
    const orderId = data.id;

    // Initialize Razorpay Payment Gateway
    const options = {
      key: 'rzp_test_XYZ123', // Your Razorpay API key (Demo key for development)
      amount: 5000, // Amount in paise
      currency: 'INR',
      name: 'Ticket Purchase',
      description: 'Event Booking',
      order_id: orderId,
      handler: function (response: any) {
        alert('Payment Successful');
        console.log(response); // You can process the response further here.
      },
      prefill: {
        name: names ? names.join(', ') : 'Anonymous',
        email: 'test@example.com',
        contact: '9876543210',
      },
      theme: {
        color: '#2d3e50',
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, margin: '0 auto', padding: 3, backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Ticket Confirmation
      </Typography>

      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          Booking Details:
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: 1 }}>
          Number of People: {increment}
        </Typography>
        {names && names.map((name: string, index: number) => (
          <Box key={index} sx={{ marginBottom: 2 }}>
            <Typography variant="body2">Name {index + 1}: {name}</Typography>
            <Typography variant="body2">Age {index + 1}: {ages[index]}</Typography>
          </Box>
        ))}
      </Box>

      <Button
        onClick={handlePayment}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ padding: '10px', fontSize: '1rem', fontWeight: 'bold', marginTop: 2 }}
      >
        Pay Now
      </Button>
    </Box>
  );
};

export default TicketConfirmation;
