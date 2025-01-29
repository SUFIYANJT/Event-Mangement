import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TicketConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { names, ages, increment } = location.state || {};
  const str = localStorage.getItem('user')
  const user = JSON.parse(str!=null?str:'Anonymous')

  const loadRazorpay = async () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  
  const handlePayment = async () => {
    // Load Razorpay dynamically
    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      alert("Failed to load Razorpay. Please check your internet connection.");
      return;
    }
  
    // 1. Make API request to backend
    const response = await fetch('http://127.0.0.1:3000/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 5000, currency: 'INR' }),
    });
  
    if (!response.ok) {
      alert("Failed to create order. Please try again.");
      return;
    }
  
    const data = await response.json();
    const orderId = data.id;
  
    // 2. Initialize Razorpay Checkout
    const options = {
      key: 'rzp_test_B8eLvy5XIIbavj', // Replace with your actual key
      amount: 5000,
      currency: 'INR',
      name: 'Event Booking',
      description: 'Ticket Purchase',
      order_id: orderId,
      handler: async function (response: any) {
        alert('Payment successful!');
        console.log(response);//login
        try{
          const res = await axios.post("http://127.0.0.1:3000/booking", {
            response,user
          },
            {
              headers: {
                "Content-Type": "application/json"// Specify JSON in the headers
              },
            }
          )
          console.log(res);
        }catch(err){
          console.error(err)
        }
      },
      prefill: {
        name: names ? names.join(', ') : user.name,
        email: user.email,
        contact: '9876543210',
      },
      theme: { color: '#2d3e50' },
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
