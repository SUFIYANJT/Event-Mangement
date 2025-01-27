import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Skeleton, Button } from '@mui/material';
import '../Static/DetailsEvent.css';

import Header from '../Compunents/Header';

const DetailsEvent = () => {
  const navigate = useNavigate();
  const { data } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const desc = queryParams.get('desc');
  
  const [loading, setLoading] = useState(true);

  // Simulating loading of event data
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000); // Simulate loading for 3 seconds
    return () => clearTimeout(timer);
  }, []);

  const handleBookingClick = () => {
    navigate('/BookingDetails');
  };

  // Parsing event data from the URL parameter
  const { title = 'not available', date = 'not available', image = 'not available', location: eventLocation = 'not available', slots = '' } = 
    data ? JSON.parse(decodeURIComponent(data)) : {};

  // Fallback for missing data
  const finalSlots = slots || 'Not Available';

  // State for wishlist
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlistClick = () => {
    setIsWishlisted((prev) => !prev);
  };

  return (
    <div>
      <Header />
      <div className="event-details">
        {/* Show skeleton if loading */}
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={300} sx={{ mb: 2 }} />
        ) : (
          <img
            className="event-image"
            src={image || 'https://via.placeholder.com/1920x1080'}
            alt={title}
          />
        )}

        {/* Overlay for better readability */}
        <div className="event-overlay"></div>

        {/* Wishlist Button */}
        <div
          className={`wishlist-icon ${isWishlisted ? 'wishlisted' : ''}`}
          onClick={handleWishlistClick}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          {isWishlisted ? '❤️ ' : '🤍 '}
        </div>

        {/* Event Content */}
        <div className="event-content">
          <div className="event-header">
            {loading ? (
              <>
                <Skeleton width="60%" height={40} />
                <Skeleton width="40%" />
              </>
            ) : (
              <>
                <h1>{title || 'Unknown Event'}</h1>
                <p>{date || 'Date not available'}</p>
              </>
            )}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventLocation)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="gmap-link"
            >
              {loading ? (
                <Skeleton width="40%" />
              ) : (
                'View on Google Maps'
              )}
            </a>
          </div>
        </div>
      </div>

      {/* Event Description */}
      {loading ? (
        <Skeleton width="80%" height={50} />
      ) : (
        <p>{desc || 'Data not available'}</p>
      )}

      <button className="book-now-button" onClick={handleBookingClick}>
        {loading ? <Skeleton width="50%" height={40} /> : 'Book Now'}
      </button>

      <div className="button-slots">
        {loading ? (
          <Skeleton width="40%" height={30} />
        ) : (
          <h3>Available slots: {finalSlots}</h3>
        )}
      </div>
    </div>
  );
};

export default DetailsEvent;
