import React, { useState, useEffect } from 'react';
import '../Static/HomePage.css';
import Header from '../Compunents/Header';
import EventSearchAndFilters from '../Compunents/EventSearchAndFilters';
import { Link } from 'react-router-dom';
import { Button, Skeleton } from '@mui/material';

const Homepage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for data (e.g., API call)
    const timer = setTimeout(() => setLoading(false), 3000); // 3 seconds loading time
    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  const eventHighlights = [
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
  ];

  const upcomingEvents = [
    {
      title: 'Music Festival',
      desc: 'Join us for an unforgettable night of live performances by top artists.',
      location: 'Central Park, NY',
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y29uY2VydHxlbnwwfHwwfHx8MA%3D%3D'
    }
  ];

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
            {loading
              ? [...Array(2)].map((_, idx) => (
                  <div key={idx} className="event-card">
                    <Skeleton variant="rectangular" width={210} height={118} sx={{ mb: 2 }} />
                    <Skeleton width="60%" />
                    <Skeleton width="80%" />
                    <Skeleton width="40%" />
                  </div>
                ))
              : eventHighlights.map((highlight, idx) => (
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
            {loading
              ? [...Array(1)].map((_, idx) => (
                  <div key={idx} className="event-card">
                    <Skeleton variant="rectangular" width={210} height={118} sx={{ mb: 2 }} />
                    <Skeleton width="60%" />
                    <Skeleton width="80%" />
                    <Skeleton width="40%" />
                  </div>
                ))
              : upcomingEvents.map((event, idx) => (
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
