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
const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<HomePage />} />
         
          <Route path="/event-details/:data" element={<DetailsEvent />} />
          <Route path='/BookingDetails' element={<BookingDetails />} />
          <Route path='/ticket-confirmation' element={<TicketConfirmation />} />
          <Route path='/Wishlist' element={<Wishlist />} />
          <Route path='/Profile' element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
