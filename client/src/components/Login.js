import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';
import API from "../api";

function Login() {

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {

      if (user.role === 'owner') {
        navigate('/mess-dashboard');
      } else {
        navigate('/student-dashboard');
      }

    }

  }, [navigate]);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await fetch(`${API}/api/auth/login`, {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(formData)

      });

      const data = await res.json();

      if (res.ok) {

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        alert("✅ Welcome back, " + data.user.name + "!");

        if (data.user.role === 'owner') {

          navigate('/mess-dashboard');

        } else {

          navigate('/');

        }

        window.location.reload();

      } else {

        alert("❌ Login Failed: " + (data.msg || "Check details"));

      }

    } catch (error) {

      console.error(error);
      alert("⚠️ Server Error. Backend may be sleeping (Render cold start).");

    }

  };

  return (

    <div className="login-container">

      <div className="logo-wrapper">

        <div className="logo-icon">
          <i className="fas fa-utensils"></i>
        </div>

        <span className="logo-text">MealConnect</span>

      </div>

      <div className="login-card">

        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Log in to your account</p>

        <form onSubmit={handleSubmit}>

          <div className="mb-4">

            <label className="form-label">Email</label>

            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="your@email.com"
              onChange={handleChange}
              required
            />

          </div>

          <div className="mb-4">

            <label className="form-label">Password</label>

            <div className="password-wrapper">

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-input"
                placeholder="••••••••"
                onChange={handleChange}
                required
              />

              <span className="password-toggle" onClick={togglePasswordVisibility}>

                <i className={`far ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>

              </span>

            </div>

          </div>

          <button type="submit" className="login-btn">

            Log In

          </button>

        </form>

        <p className="signup-text">

          Don't have an account?

          <Link to="/register" className="signup-link">

            Sign Up

          </Link>

        </p>

      </div>

    </div>

  );

}

export default Login;
