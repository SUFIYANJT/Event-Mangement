import React, { useEffect, useState } from 'react';
import '../Static/HomePage.css';
import Header from '../Compunents/Header';
import EventSearchAndFilters from '../Compunents/EventSearchAndFilters';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import axios from 'axios';

interface Events {
  name: string,
  description: string,
  created_at: Date,
  created_by: string,
  file_path: string,
  slots: number,
}

const Homepage = () => {
  const [events, SetEvents] = useState()

  useEffect(() => {
    // Define an async function inside the effect
    const signupUser = async () => {
      // Retrieve user from localStorage and handle cases where it may be null
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        alert('User data is missing');
        return;
      }
    
      const user = JSON.parse(userStr);
      console.log('User:', user);
    
      // Retrieve token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Token is missing');
        return;
      }
      console.log("token is :"+token)
    
      try {
        console.log("Sending user data to server...");
    
        // Send the request with proper headers and body
        const response = await axios.post(
          "http://127.0.0.1:3000/event", // Your API endpoint
          user, // The user object to send
          {
            headers: {
              "Content-Type": "application/json", // Specify the content type
              Authorization: `Bearer ${token}`,   // Send the token in the Authorization header
            },
          }
        );
    
        console.log("Response:", response.data);
    
        // Handle the server response
        if (response.data.success) {
          console.log("Event created successfully, navigate to home page");
        } else {
          alert(response.data.message); // Show error message if any
        }
      } catch (error) {
        console.error("Error submitting data:", error);
        alert("Failed to submit data.");
      }
    };
    
    // Call the async function
    signupUser();
    

    // Call the async function
  }, []); // Include 'cred' as a dependency to track changes
  return (
    <div>
      <Header />
      <main>
        <section>
          <EventSearchAndFilters />
        </section>

        <section>
          <h2>Tickets Live</h2>
          <div className="event-highlights">
            {[
              {
                title: 'Music Fest',
                desc: 'Join us for a night of unforgettable music and energy.',
                date: 'November 12, 2023',
                action: 'Buy Tickets',
                image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?cs=srgb&dl=pexels-sebastian-ervi-866902-1763075.jpg&fm=jpg',
                location: 'India',
                slots: 9
              },
              {
                title: 'Art Expo',
                desc: 'Explore modern art at its finest with our curated exhibition.',
                date: 'October 28, 2023',
                action: 'Buy Tickets',
                image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?cs=srgb&dl=pexels-sebastian-ervi-866902-1763075.jpg&fm=jpg',
                location: 'India',
                slots: 9
              }
            ].map((highlight, idx) => (
              <div key={idx} className="event-card">
                <img src={highlight.image} alt={highlight.title} />
                <div className="event-card-content">
                  <h3>{highlight.title}</h3>
                  <p>{highlight.desc}</p>
                  <p className="location">{highlight.date}</p>
                  <Link
                    to={`/event-details/${encodeURIComponent(
                      JSON.stringify({
                        title: highlight.title,
                        desc: highlight.desc,
                        date: highlight.date,
                        image: highlight.image,
                        location: highlight.location,
                        slots: highlight.slots
                      })
                    )}`}
                    className="details-link"
                  >
                    <Button variant='outlined'>{highlight.action}</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>Upcoming Events</h2>
          <div className="upcoming-events">
            {[
              {
                title: 'Music Festival',
                desc: 'Join us for an unforgettable night of live performances by top artists.',
                location: 'Central Park, NY',
                image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y29uY2VydHxlbnwwfHwwfHx8MA%3D%3D'
              }
            ].map((event, idx) => (
              <div key={idx} className="event-card">
                <img src={event.image} alt={event.title} />
                <div className="event-card-content">
                  <h3>{event.title}</h3>
                  <p>{event.desc}</p>
                  <p className="location">{event.location}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Homepage;
