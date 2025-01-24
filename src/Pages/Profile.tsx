import React from 'react';
import { Box, Typography, Card, CardMedia, CardContent, CardActions, Button, Grid } from '@mui/material';
import Header from '../Compunents/Header';
const Profile: React.FC = () => {
  return (
    <div>
    <Header />
    <Box p={4}>
      
      {/* User Information */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          User Information
        </Typography>
        <Typography>Name: John Doe</Typography>
        <Typography>Email: johndoe@example.com</Typography>
        <Typography>Username: johndoe123</Typography>
      </Box>

      {/* Booking History */}
      <Box>
        <Typography variant="h5" gutterBottom>
          Booking History
        </Typography>
        <Grid container spacing={3}>
          {/* Paris Trip Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image="https://source.unsplash.com/featured/?paris"
                alt="Paris Trip"
              />
              <CardContent>
                <Typography variant="h6">Paris Trip</Typography>
                <Typography>Booking Date: 2023-07-21</Typography>
                <Typography>Status: Completed</Typography>
              </CardContent>
              <CardActions>
                <Button variant="outlined" color="primary">
                  Cancel Ticket
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Tokyo Adventure Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image="https://source.unsplash.com/featured/?tokyo"
                alt="Tokyo Adventure"
              />
              <CardContent>
                <Typography variant="h6">Tokyo Adventure</Typography>
                <Typography>Booking Date: 2023-05-15</Typography>
                <Typography>Status: Completed</Typography>
              </CardContent>
              <CardActions>
                <Button variant="outlined" color="primary">
                  Cancel Ticket
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Sydney Escape Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image="https://source.unsplash.com/featured/?sydney"
                alt="Sydney Escape"
              />
              <CardContent>
                <Typography variant="h6">Sydney Escape</Typography>
                <Typography>Booking Date: 2023-03-10</Typography>
                <Typography>Status: Cancelled</Typography>
              </CardContent>
              <CardActions>
                <Button variant="outlined" color="secondary">
                  Rebook
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
    </div>
  );
};

export default Profile;
