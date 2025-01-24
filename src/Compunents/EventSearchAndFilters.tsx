import React, { useState } from 'react';
import './EventSearchAndFilters.css';
import { FaSearch, FaFilter } from 'react-icons/fa';

const EventSearchAndFilters = () => {
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="event-search-and-filters">
      {/* Search Section */}
      <section className="search-section">
        <div className="search-bar">
          <input type="text" placeholder="Search for events..." />
          <button className="search-button">
            <FaSearch />
            <span>Search</span>
          </button>
          <button className="filter-button" onClick={toggleFilters}>
            <FaFilter />
          </button>
        </div>
      </section>

      {/* Filter Section */}
      {showFilters && (
        <section className="filter-section">
          <h2>Filter Options</h2>
          <div className="filter-options">
            <input type="date" placeholder="Select date" />
            <input type="text" placeholder="Select category" />
            <input type="text" placeholder="Select location" />
            <div className="filter-checkboxes">
              {['Event A', 'Event B', 'Event C'].map((event, idx) => (
                <label key={idx}>
                  <input type="checkbox" />
                  {event}
                </label>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default EventSearchAndFilters;
