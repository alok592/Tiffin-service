import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from "../api";

function Register() {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      if (user.role === "owner") {
        navigate("/mess-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    }

  }, [navigate]);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {

        alert("🎉 Registration Successful! Please Login.");
        navigate("/login");

      } else {

        alert(data.msg || "Registration Failed");

      }

    } catch (error) {

      console.error(error);
      alert("⚠️ Server Error. Backend may be sleeping (Render cold start). Try again.");

    }

  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light" style={{padding:"40px 20px"}}>

      <div className="card shadow-lg border-0" style={{maxWidth:"500px", width:"100%", borderRadius:"15px"}}>

        <div className="card-body p-4 p-sm-5">

          <div className="text-center mb-4">

            <div className="d-flex align-items-center justify-content-center gap-2 mb-3">

              <div className="bg-primary-brand text-white rounded p-2 d-flex align-items-center justify-content-center" style={{width:"40px",height:"40px"}}>
                <i className="fas fa-utensils"></i>
              </div>

              <h2 className="brand-font fw-bold m-0">MealConnect</h2>

            </div>

            <h3 className="fw-bold">Create Account</h3>
            <p className="text-muted">Join MealConnect today</p>

          </div>

          <form onSubmit={handleSubmit}>

            {/* Role Toggle */}

            <div className="d-flex bg-light rounded-3 p-1 mb-4 border">

              <button
                type="button"
                className={`btn w-50 ${formData.role==="student" ? "bg-white shadow-sm fw-bold":"text-muted"}`}
                onClick={()=>setFormData({...formData, role:"student"})}
              >
                Student
              </button>

              <button
                type="button"
                className={`btn w-50 ${formData.role==="owner" ? "bg-white shadow-sm fw-bold":"text-muted"}`}
                onClick={()=>setFormData({...formData, role:"owner"})}
              >
                Mess Owner
              </button>

            </div>

            {/* Name */}

            <div className="mb-3">

              <label className="form-label fw-bold">Full Name</label>

              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="John Doe"
                onChange={handleChange}
                required
              />

            </div>

            {/* Email */}

            <div className="mb-3">

              <label className="form-label fw-bold">Email</label>

              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="your@email.com"
                onChange={handleChange}
                required
              />

            </div>

            {/* Password */}

            <div className="mb-4">

              <label className="form-label fw-bold">Password</label>

              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="••••••••"
                onChange={handleChange}
                required
              />

            </div>

            <button
              type="submit"
              className="btn btn-premium w-100 py-2 fs-5"
            >
              Create Account
            </button>

          </form>

          <p className="text-center mt-4 text-muted">

            Already have an account?

            <Link to="/login" className="fw-bold text-primary-brand ms-1">
              Log In
            </Link>

          </p>

        </div>

      </div>

    </div>
  );

}

export default Register;
