import React from "react";
import "../../styles/form.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import foodpartner_reg_img from "../../assets/images/user_registeration_img.png";

const FoodPartnerRegister = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const phone = e.target.phone.value;
    const address = e.target.address.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/food-partner/register",
        {
          name,
          email,
          contact: phone,
          address,
          password,
        },
        {
          withCredentials: true,
        }
      );

      console.log(response.data);
      navigate("/create-food");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="page-container">
      <div className="page-container-box fp_reg_img_box">
        <div className="image-box">
          <img
            className="user-image"
            src={foodpartner_reg_img}
            alt="Food Partner Registration"
          />
        </div>

        <form
          className="modern-form"
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <div className="form-header">
            <span className="form-badge">🍽️ Partner Portal</span>
            <h2>Food Partner Register</h2>
            <p className="form-tagline">
              Join our network and start serving thousands of customers.
            </p>
          </div>

          <div className="form-group">
            <label>Name</label>
            <input
              name="name"
              type="text"
              placeholder="Restaurant Owner Name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="form-group">
            <label>Contact Number</label>
            <input
              name="phone"
              type="tel"
              placeholder="Enter mobile number"
              required
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              name="address"
              type="text"
              placeholder="Restaurant address"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Create strong password"
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Register Partner
          </button>

          <div className="form-footer">
            <p>
              Already a partner?
              <Link to="/food-partner/login"> Login</Link>
            </p>

            <p>
              Register as:
              <Link to="/user/register"> User</Link>
              <span> | </span>
              <Link to="/food-partner/register"> Food Partner</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FoodPartnerRegister;
