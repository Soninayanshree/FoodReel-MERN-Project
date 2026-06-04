import React from "react";
import "../../styles/form.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import foodpartner_login_img from "../../assets/images/user_login_img1.png";

const FoodPartnerLogin = () => {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    console.log(email, password);

    const response = await axios.post(
      "http://localhost:3000/api/auth/food-partner/login",
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );
    console.log(response.data);
    navigate("/create-food");
  };
  return (
    <div className="page-container">
      <div className="page-container-box">
        <div className="image-box">
          <img className="user-image" src={foodpartner_login_img} alt="" />
        </div>
        <form className="form-box simple-form" autoComplete="off" onSubmit={handleSubmit}>
          <h2>Food Partner Login</h2>
          <div className="form-tagline">
            Welcome back! Please login to manage your restaurant and orders.
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" autoComplete="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          <button type="submit" className="medium-btn">
            Login
          </button>
          <div className="form-footer">
            New partner?
            <a href="/food-partner/register">Register</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;
