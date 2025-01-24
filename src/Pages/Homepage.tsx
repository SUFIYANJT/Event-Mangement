import React from 'react';
import '../Static/HomePage.css';
import Header from '../Compunents/Header';
import EventSearchAndFilters from '../Compunents/EventSearchAndFilters';
import { Link } from 'react-router-dom';
import  {Button } from '@mui/material';
const Homepage = () => {
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
                location: 'india',
                slots: 9
              },
              {
                title: 'Art Expo',
                desc: 'Explore modern art at its finest with our curated exhibition.',
                date: 'October 28, 2023',
                action: 'Buy Tickets',
                image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?cs=srgb&dl=pexels-sebastian-ervi-866902-1763075.jpg&fm=jpg',
                location: 'india',
                slots: 9
              }
            ].map((highlight, idx) => (
              <div key={idx} className="event-card">
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
                  )}?desc=${encodeURIComponent(highlight.desc)}`}
                >
                  <img src={highlight.image} alt={highlight.title} />
                  <h3>{highlight.title}</h3>
                  <p>{highlight.desc}</p>
                  <p className="location">{highlight.date}</p>
                  <Button variant="outlined" color="primary">{highlight.action}</Button>
                </Link>
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
                <h3>{event.title}</h3>
                <p>{event.desc}</p>
                <p className="location">{event.location}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Homepage;
