import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import '../Static/DetailsEvent.css';
import Header from '../Compunents/Header';

const DetailsEvent = () => {
  const navigate = useNavigate();
  const { data } = useParams<{ data: string }>();

  // Parsing event data from the URL parameter
  
  const {
    title = 'Not Available',
    date = 'Not Available',
    image = 'Not Available',
    location: eventLocation = 'Not Available',
    slots = 'Not Available',
    desc = 'Description not available',
  } = data ? JSON.parse(decodeURIComponent(data)) : {};
  console.log(data)

  // State for wishlist
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Check if event is already in the wishlist (on initial render)
  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const isEventInWishlist = storedWishlist.some((event: any) => event.title === title);
    setIsWishlisted(isEventInWishlist);
  }, [title]);

  const handleWishlistClick = () => {
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    // If event is not in the wishlist, add it
    if (!isWishlisted) {
      storedWishlist.push({
        title,
        date,
        image,
        eventLocation,
        slots,
        desc,
      });
    } else {
      // Otherwise, remove it from the wishlist
      const updatedWishlist = storedWishlist.filter((event: any) => event.title !== title);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setIsWishlisted(false);
      return;
    }

    // Save updated wishlist to local storage
    localStorage.setItem('wishlist', JSON.stringify(storedWishlist));
    setIsWishlisted(true);
  };

  const handleBookingClick = () => {
    // Passing the event data to the BookingDetails page
    navigate('/BookingDetails', {
      state: {
        title,
        date,
        image,
        eventLocation,
        slots,
        desc,
      },
    });
  };

  return (
    <div>
      <Header />
      <div className="event-details">
        {/* Full-Width Background Image */}
        <img
          className="event-image"
          src={`http://localhost:8000${image}`}
          alt={title}
        />

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
            <h1>{title}</h1>
            <p>{date}</p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                eventLocation
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="gmap-link"
            >
              View on Google Maps
            </a>
          </div>
        </div>
      </div>

      {/* Description */}
      <p>{desc}</p>

      {/* Book Now Button */}
      <button
        className="book-now-button"
        onClick={handleBookingClick}
      >
        Book Now
      </button>

      {/* Slots Info */}
      <div className="button-slots">
        <h3>Available slots: {slots}</h3>
      </div>
    </div>
  );
};

export default DetailsEvent;