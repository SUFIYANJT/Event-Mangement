import React from 'react';
import { Link } from 'react-router-dom';
import '../Static/LoginPage.css';

// Import FontAwesome components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faGoogle, faTwitter, faGithub } from '@fortawesome/free-brands-svg-icons';

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-register-buttons">
        <button className="login-button active">LOGIN</button>
        <Link to="/signup">
          <button className="register-button">REGISTER</button>
        </Link>
      </div>
      <p>Sign in with:</p>
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
      <form className="login-form">
        <input type="text" placeholder="Email or username" className="input-field" />
        <input type="password" placeholder="Password" className="input-field" />
        <div className="remember-forgot">
          <label>
            <input type="checkbox" className="remember-me" />
            Remember me<br></br>
          </label>  
          
          <a href="#" className="forgot-password">Forgot password?</a>
        </div>
        <button type="submit" className="sign-in-button">SIGN IN</button>
      </form>
      <p>Not a member? <Link to="/signup" className="register-link">Register</Link></p>
    </div>
  );
};

export default Login;
