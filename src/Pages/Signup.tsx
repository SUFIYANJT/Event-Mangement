import React from 'react';
import { Link } from 'react-router-dom';
import '../Static/Signup.css';

// Import FontAwesome components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faGoogle, faTwitter, faGithub } from '@fortawesome/free-brands-svg-icons';

const Signup = () => {
  return (
    <div className="signup-container">
      {/* Navigation Bar */}
      <div className="login-register-buttons">
        <Link to="/login">
          <button className="login-button">LOGIN</button>
        </Link>
        <button className="register-button active">REGISTER</button>
      </div>

      <p>Sign up with:</p>
      <div className="social-login">
        <button className="social-button facebook">
          <FontAwesomeIcon icon={faFacebook} />
        </button>
        <button className="social-button google">
          <FontAwesomeIcon icon={faGoogle} />
        </button>
        <button className="social-button twitter">
          <FontAwesomeIcon icon={faTwitter} />
        </button>
        <button className="social-button github">
          <FontAwesomeIcon icon={faGithub} />
        </button>
      </div>

      <p>or:</p>
      <form className="signup-form">
        <input type="text" placeholder="Username" className="input-field" />
        <input type="email" placeholder="Email" className="input-field" />
        <input type="password" placeholder="Password" className="input-field" />
        <input type="password" placeholder="Confirm Password" className="input-field" />
        
        
        <button type="submit" className="sign-up-button">SIGN UP</button>
        
      </form>

      <p>
        Already have an account? <Link to="/login" className="register-link">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
