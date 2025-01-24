import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../Static/DetailsEvent.css';

import Header from '../Compunents/Header';

const DetailsEvent = () => {
    const navigate = useNavigate()
  const { data } = useParams<{ data: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const desc = queryParams.get('desc');
  const handleBookingClick=()=>{
    navigate('/BookingDetails');
  }
  // Parsing event data from the URL parameter
  const { title='not availa', date='not', image='not', location: eventLocation='not', slots=' ' } = data ? JSON.parse(decodeURIComponent(data)) : {};

  // Fallback for missing data
  const finalSlots = slots || 'Not Available';

  console.log('Decoded Data:', { title, date, image, eventLocation, slots }); // Debugging

  // State for wishlist
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlistClick = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div>
      <Header />
      <div className="event-details">
        {/* Full-Width Background Image */}
        <img
          className="event-image"
          src={image || 'https://via.placeholder.com/1920x1080'}
          alt={title}
        />

        {/* Overlay for better readability */}
        <div className="event-overlay"></div>

        {/* Wishlist Button */}
        <div
          className={`wishlist-icon ${isWishlisted ? 'wishlisted' : ''}`}
          onClick={handleWishlistClick}
        >
          ❤️
        </div>

        {/* Event Content */}
        <div className="event-content">
          <div className="event-header">
            <h1>{title || 'Unknown Event'}</h1>
            <p>{date || 'Date not available'}</p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventLocation)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="gmap-link"
            >
              View on Google Maps
            </a>
          </div>
        </div>
      </div>
      <h1>{desc || 'Data not available'}</h1>
      
      <button
        className="book-now-button"
        onClick={handleBookingClick}
      >
        Book Now
      </button>
      <div className='button-slots'>
      <h3>Available slots: {finalSlots}</h3>
    </div>
    </div>
  );
};

export default DetailsEvent;
