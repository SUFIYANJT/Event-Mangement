import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Static/LoginPage.css';

// Import FontAwesome components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faGoogle, faTwitter, faGithub } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';

interface Credential {
  username: string,
  password: string
}

const Login = () => {
  const [cred, setCred] = useState({
    username: "",
    password: ""
  })
  const navigator = useNavigate()
  useEffect(() => {
    console.log(localStorage.getItem('token'));
    
    if (localStorage.getItem('token') != null) {
      const check = async () => {
        try {
          const response = await axios.post("http://127.0.0.1:3000/check", {},
            {
              headers: {
                "Content-Type": "application/json", // Specify JSON in the headers
                Authorization: localStorage.getItem('token')
              },
            }
          )
          if (response.data['success']) {
            const user = JSON.parse(localStorage.getItem('user') || "{}")
            if (user["id"] != null && user["is_staff"]) {
              navigator("/Orgainzer")
            } else {
              navigator("/HomePage")
            }
          }
        } catch (err) {
          console.error(err)
        }
      }
      check();
    } else {
      console.log("token is null");

    }
  }, [])
  const handleSubmit = async (eve: React.FormEvent) => {
    try {
      console.log(cred)
      const response = await axios.post("http://127.0.0.1:3000/login", cred, {
        headers: {
          "Content-Type": "application/json", // Specify JSON in the headers
        },
      });
      console.log("Response:", response.data);

      if (response.data["success"]) {
        console.log("Navigate to home page")
        localStorage.setItem('token', response.data["message"]["token"])
        localStorage.setItem('user', JSON.stringify(response.data["message"]["user"]))
        console.log(localStorage.getItem('token'), localStorage.getItem('user'), response.data);

        alert("New user logined")
      } else {
        alert(response.data["message"]["user"]["username"] + " is logging in ");
      }

    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Failed to submit data.");
    }
  }
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
      <form onSubmit={handleSubmit} className="login-form">
        <input type="text" placeholder="Email or username" className="input-field" value={cred.username} onChange={(eve) => {
          setCred((prev) => ({
            ...prev,
            username: eve.target.value,
          }));
        }} />
        <input type="password" placeholder="Password" className="input-field" value={cred.password}
          onChange={(eve) => {
            setCred((prev) => ({
              ...prev,
              password: eve.target.value,
            }));
          }} />
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
