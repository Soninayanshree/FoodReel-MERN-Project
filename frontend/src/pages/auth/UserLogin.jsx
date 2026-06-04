import React from 'react';
import '../../styles/form.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import user_login_img from '../../assets/images/user_login_img1.png';

const UserLogin = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/user/login',
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      console.log(response.data);
      navigate('/');
    } catch (error) {
      console.error(
        error.response?.data?.message || 'Login failed'
      );
    }
  };

  return (
    <div className="page-container">
      <div className="page-container-box">

        <div className="image-box">
          <img
            className="user-image"
            src={user_login_img}
            alt="Login"
          />
        </div>

        <form
          className="form-box"
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <h2>Welcome Back 👋</h2>

          <p className="form-tagline">
            Sign in to discover amazing food around you.
          </p>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

          <div className="form-footer">
            New user?
            <Link to="/user/register"> Create Account</Link>
          </div>
        </form>

      </div>
    </div>
  );
};

export default UserLogin;