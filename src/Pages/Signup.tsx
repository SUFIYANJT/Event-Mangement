import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Static/Signup.css';
import axios from "axios";

// Import FontAwesome components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faGoogle, faTwitter, faGithub } from '@fortawesome/free-brands-svg-icons';

interface Credential {
  username: string,
  email: string,
  password: string
  con_password: string
}

const Signup = () => {
  const [cred, setCred] = useState<Credential>({
    username: "",
    email: "",
    password: "",
    con_password: ""
  });
  const navigator = useNavigate()
  useEffect(() => {
    console.log(localStorage.getItem('token'), localStorage.getItem('user'))
    if (localStorage.getItem("token") != null || localStorage.getItem("token") != "") {
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
            console.log("user", user);
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
    }
  }, [])
  const handleSignup = async (e: React.FormEvent) => {
    try {
      console.log(cred)
      const response = await axios.post("http://127.0.0.1:3000/signup", cred, {
        headers: {
          "Content-Type": "application/json", // Specify JSON in the headers
        },
      });
      console.log("Response:", response.data);
      if (response.data["success"]) {
        localStorage.setItem('token', response.data["message"]["token"])
        localStorage.setItem('user', JSON.stringify(response.data["message"]["user"]))
        console.log(localStorage.getItem('token'), localStorage.getItem('user'), response.data);
        console.log("Navigate to home page")
        const user = JSON.parse(localStorage.getItem('user') || "{}")
        console.log("user", user);
        if (user["id"] != null && user["is_staff"]) {
          navigator("/Orgainzer")
        } else {
          navigator("/HomePage")
        }
      } else {
        alert(response.data["message"]);
      }

    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Failed to submit data.");
    }
  }
  return (
    <div className="signup-container">
      {/* Navigation Bar */}
      <div className="login-register-buttons">
        <Link to="/">
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
        <input
          type="text"
          placeholder="Username"
          className="input-field"
          onChange={(eve) => {
            setCred((prev) => ({
              ...prev,
              username: eve.target.value,
            }));
          }}
          value={cred.username}
        />
        <input type="email" placeholder="Email" className="input-field" onChange={(eve) => {
          setCred((prev) => ({
            ...prev,
            email: eve.target.value,
          }));
        }}
          value={cred.email}
        />
        <input type="password" placeholder="Password" className="input-field" onChange={(eve) => {
          setCred((prev) => ({
            ...prev,
            password: eve.target.value,
          }));
        }}
          value={cred.password}
        />
        <input type="password" placeholder="Confirm Password" className="input-field" onChange={(eve) => {
          setCred((prev) => ({
            ...prev,
            con_password: eve.target.value,
          }));
        }}
          value={cred.con_password}
        />
        <button type="submit" className="sign-up-button" onClick={handleSignup}>SIGN UP</button>

      </form>

      <p>
        Already have an account? <Link to="/" className="register-link">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
