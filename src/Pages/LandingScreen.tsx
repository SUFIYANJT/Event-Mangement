import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LandingScreen = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Use navigate to redirect after loading

  useEffect(() => {
    // Simulate a loading time (e.g., API call)
    const timer = setTimeout(() => {
      setLoading(false); // After 3 seconds, set loading to false
      navigate("/login"); // Navigate to the login screen
    }, 3000); // 3 seconds

    return () => clearTimeout(timer); // Cleanup timeout on component unmount
  }, [navigate]);

  if (loading) {
    // Infinite Loading Screen
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          textAlign: "center",
          bgcolor: "#f5f5f5",
        }}
      >
        <CircularProgress
          sx={{
            color: "#007bff",
            mb: 3,
            animation: "spin 1.5s linear infinite",
            "@keyframes spin": {
              "0%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(360deg)" },
            },
          }}
          size={70}
        />
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            animation: "pulse 2s infinite",
            "@keyframes pulse": {
              "0%": { opacity: 0.8 },
              "50%": { opacity: 1 },
              "100%": { opacity: 0.8 },
            },
          }}
        >
          Loading MyApp...
        </Typography>
      </Box>
    );
  }

  return null; // This part will never be rendered due to redirection
};

export default LandingScreen;
