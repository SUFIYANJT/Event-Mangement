import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardMedia, CardContent, CardActions, Button, Grid, Skeleton } from '@mui/material';
import Header from '../Compunents/Header';

// Define a type for the booking history
interface Booking {
  title: string;
  date: string;
  status: string;
  image: string;
}

const Profile: React.FC = () => {
  const [loading, setLoading] = useState(true); // Simulating data loading
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    username: '',
  });
  const [bookingHistory, setBookingHistory] = useState<Booking[]>([]); // Explicitly typed as an array of Booking objects

  useEffect(() => {
    // Simulating data fetch
    setTimeout(() => {
      setUserInfo({
        name: 'John Doe',
        email: 'johndoe@example.com',
        username: 'johndoe123',
      });
      setBookingHistory([
        { title: 'Paris Trip', date: '2023-07-21', status: 'Completed', image: 'https://source.unsplash.com/featured/?paris' },
        { title: 'Tokyo Adventure', date: '2023-05-15', status: 'Completed', image: 'https://source.unsplash.com/featured/?tokyo' },
        { title: 'Sydney Escape', date: '2023-03-10', status: 'Cancelled', image: 'https://source.unsplash.com/featured/?sydney' },
      ]);
      setLoading(false); // Data is loaded
    }, 2000); // Simulate a 2-second delay
  }, []);

  return (
    <div>
      <Header />
      <Box p={4}>
        {/* User Information */}
        <Box mb={4}>
          <Typography variant="h5" gutterBottom>
            User Information
          </Typography>
          {loading ? (
            <Skeleton variant="text" width="40%" height={30} />
          ) : (
            <>
              <Typography>Name: {userInfo.name}</Typography>
              <Typography>Email: {userInfo.email}</Typography>
              <Typography>Username: {userInfo.username}</Typography>
            </>
          )}
        </Box>

        {/* Booking History */}
        <Box>
          <Typography variant="h5" gutterBottom>
            Booking History
          </Typography>
          {loading ? (
            <Grid container spacing={3}>
              {[...Array(3)].map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <Skeleton variant="rectangular" width="100%" height={140} />
                    <CardContent>
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="text" width="40%" />
                      <Skeleton variant="text" width="50%" />
                    </CardContent>
                    <CardActions>
                      <Button variant="outlined" color="primary" disabled>
                        <Skeleton width={80} height={30} />
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={3}>
              {/* Render actual booking history */}
              {bookingHistory.map((booking, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardMedia component="img" height="140" image={booking.image} alt={booking.title} />
                    <CardContent>
                      <Typography variant="h6">{booking.title}</Typography>
                      <Typography>Booking Date: {booking.date}</Typography>
                      <Typography>Status: {booking.status}</Typography>
                    </CardContent>
                    <CardActions>
                      <Button variant="outlined" color={booking.status === 'Completed' ? 'primary' : 'secondary'}>
                        {booking.status === 'Completed' ? 'Cancel Ticket' : 'Rebook'}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default Profile;
