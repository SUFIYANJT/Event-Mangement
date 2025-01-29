import React, { useState, useEffect } from 'react';
import Header from '../Compunents/Header';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState<any[]>([]);

  useEffect(() => {
    // Fetch wishlist from localStorage
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(storedWishlist);
  }, []);

  return (
    <div>
      <Header />
      <div>
        <h2>Your Wishlist</h2>
        {wishlist.length === 0 ? (
          <p>Your wishlist is empty.</p>
        ) : (
          <div>
            {wishlist.map((event, index) => (
              <div key={index} className="wishlist-item">
                <img src={`http://localhost:8000${event.image}`} alt={event.title} />
                <div>
                  <h3>{event.title}</h3>
                  <p>{event.date}</p>
                  <p>{event.eventLocation}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;