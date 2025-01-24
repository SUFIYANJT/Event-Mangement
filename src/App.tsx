import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/LoginPAge';
import SignUp from './Pages/Signup';
import HomePage from './Pages/Homepage';
import DetailsEvent from './Pages/DetailsEvent';
import Wishlist from './Pages/Wishlist'
import BookingDetails from './Pages/BookingDetails';
// Import the global styles
import TicketConfirmation from './Pages/TicketConfirmation';
import Profile from './Pages/Profile';
import Orgainzer from './Pages/Orgainzer';
const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/event-details/:data" element={<DetailsEvent />} />
          <Route path='/BookingDetails' element={<BookingDetails />} />
          <Route path='/ticket-confirmation' element={<TicketConfirmation />} />
          <Route path='/Wishlist' element={<Wishlist />} />
          <Route path='/Profile' element={<Profile />} />
          <Route path='/Orgainzer' element={<Orgainzer />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
