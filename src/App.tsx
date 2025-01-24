import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/LoginPAge';
import SignUp from './Pages/Signup';
import HomePage from './Pages/Homepage';
import DetailsEvent from './Pages/DetailsEvent';
// Import the global styles

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/event-details/:data" element={<DetailsEvent />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;
