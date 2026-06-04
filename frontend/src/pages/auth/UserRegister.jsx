import React from 'react';
import "../../styles/form.css"
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import user_img from '../../assets/images/register.png';

const UserRegister = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    console.log(name, email, password);

    const response = await axios.post('http://localhost:3000/api/auth/user/register', {
      fullName: name,
      email,
      password
    },{
      withCredentials: true
    });
    console.log(response.data);
    navigate("/");

  };
  return (
    <div className="page-container">
      <div className='page-container-box'>
      <div className='image-box'>
      <img className="user-image" src={user_img} alt="" />
    </div>
    <form className="form-box simple-form" autoComplete="off" onSubmit={handleSubmit}>
      <h2>User Register</h2>
      <div className="form-divider"></div>
      <div className="form-tagline">
        Create your account to explore the best food around you.
      </div>
      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input id="name" type="text" autoComplete="name" required />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="email" required />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input id="password" type="password" autoComplete="new-password" required />
      </div>
      <button type="submit" className="medium-btn">Register</button>
      <div className="form-footer">
        Already have an account?
        <a href="/user/login">Login</a>
        <br />
        <span style={{ color: "#708993" }}>Or register as:</span>
        <a href="/user/register"> Normal User</a>
        <span> | </span>
        <a href="/food-partner/register"> Food Partner</a>
      </div>
    </form>
    </div>
    
  </div>
  );
};

export default UserRegister;