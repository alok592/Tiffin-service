import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student' // Default value
  });

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Server ko data bhejo
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        alert("🎉 Registration Successful! Please Login.");
        navigate('/login');
      } else {
        alert("❌ Error: " + (data.msg || "Registration Failed"));
      }
    } catch (error) {
      console.error(error);
      alert("⚠️ Server Error: Make sure backend is running.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light" style={{padding: "40px 20px"}}>
      <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '500px', borderRadius: '15px' }}>
        <div className="card-body p-sm-5 p-4">
            
            <div className="text-center mb-4">
                <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
                    <div className="bg-primary-brand text-white rounded p-2 d-flex align-items-center justify-content-center" style={{width: "40px", height: "40px"}}>
                        <i className="fas fa-utensils fs-5"></i>
                    </div>
                    <h2 className="brand-font fw-bold m-0 fs-3">MealConnect</h2>
                </div>
                <h3 className="brand-font fw-bold text-dark fs-2 mb-2">Create Account</h3>
                <p className="text-muted">Join MealConnect today</p>
            </div>
            
            <form onSubmit={handleSubmit}>
            
            {/* 🔥 MEALCONNECT TOGGLE SWITCH */}
            <div className="d-flex bg-light rounded-3 p-1 mb-4 border">
                <button type="button" 
                    className={`btn w-50 rounded-2 fw-bold border-0 ${formData.role === 'student' ? 'bg-white shadow-sm text-dark' : 'bg-transparent text-muted'}`}
                    onClick={() => setFormData({...formData, role: 'student'})}>
                    <i className="fas fa-user-graduate me-2"></i> Student
                </button>
                <button type="button" 
                    className={`btn w-50 rounded-2 fw-bold border-0 ${formData.role === 'owner' ? 'bg-white shadow-sm text-dark' : 'bg-transparent text-muted'}`}
                    onClick={() => setFormData({...formData, role: 'owner'})}>
                    <i className="fas fa-store me-2"></i> Mess Owner
                </button>
            </div>

            <div className="row g-3 mb-3">
                <div className="col-sm-6">
                    <label className="form-label small fw-bold text-dark">Full Name</label>
                    <input type="text" name="name" className="form-control px-3 py-2 bg-light border-0" onChange={handleChange} required placeholder="John Doe" />
                </div>
                <div className="col-sm-6">
                    <label className="form-label small fw-bold text-dark">Phone</label>
                    <input type="tel" className="form-control px-3 py-2 bg-light border-0" placeholder="+91 98765 43210" />
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label small fw-bold text-dark">Email</label>
                <input type="email" name="email" className="form-control px-3 py-2 bg-primary-brand bg-opacity-10 border-0 shadow-none text-dark" onChange={handleChange} required placeholder="abc@student.college.edu" />
            </div>
            
            <div className="mb-4">
                <label className="form-label small fw-bold text-dark">Password</label>
                <div className="input-group">
                    <input type="password" name="password" className="form-control px-3 py-2 bg-primary-brand bg-opacity-10 border-0 shadow-none" onChange={handleChange} required placeholder="••••••••" />
                    <span className="input-group-text bg-primary-brand bg-opacity-10 border-0"><i className="fas fa-eye text-muted"></i></span>
                </div>
            </div>

            {formData.role === 'owner' && (
                <>
                    <div className="mb-3">
                        <label className="form-label small fw-bold text-dark">Mess Name</label>
                        <input type="text" className="form-control px-3 py-2 bg-light border-0" placeholder="e.g. Annapurna Mess" />
                    </div>
                    <div className="mb-3">
                        <label className="form-label small fw-bold text-dark">Address</label>
                        <div className="input-group">
                            <input type="text" className="form-control px-3 py-2 bg-light border-0" placeholder="Full address with landmark" />
                            <span className="input-group-text bg-light border-0"><i className="fas fa-map-marker-alt text-muted"></i></span>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label small fw-bold text-dark">Description</label>
                        <textarea className="form-control px-3 py-2 bg-light border-0" rows="3" placeholder="Tell students about your mess, cuisine type, specialties..."></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="form-label small fw-bold text-dark">Food Photos</label>
                        <input 
                            type="file" 
                            id="food-photos" 
                            multiple 
                            accept="image/*" 
                            style={{ display: 'none' }} 
                            onChange={(e) => {
                                const files = Array.from(e.target.files);
                                alert(`${files.length} photos selected from your gallery!`);
                            }}
                        />
                        <label 
                            htmlFor="food-photos"
                            className="border border-secondary border-dashed rounded-3 p-4 text-center cursor-pointer hover-effect bg-light d-block"
                            style={{ cursor: 'pointer', borderStyle: 'dashed !important' }}
                        >
                            <i className="fas fa-upload fs-3 text-muted mb-2"></i>
                            <p className="m-0 text-muted small">Click to select food photos from your device gallery<br/><span className="text-secondary" style={{fontSize:"0.75rem"}}>JPG, PNG, WEBP up to 5MB each</span></p>
                        </label>
                    </div>
                </>
            )}

            {formData.role === 'student' && (
                <div className="mb-4">
                    <label className="form-label small fw-bold text-dark">College / University</label>
                    <input type="text" className="form-control px-3 py-2 bg-light border-0" placeholder="e.g. IIT Bombay" />
                </div>
            )}

            <button type="submit" className="btn btn-premium w-100 py-2 fs-5 mt-2 rounded-3">Create Account</button>
            </form>
            
            <p className="text-center mt-4 text-muted small">
                Already have an account? <Link to="/login" className="fw-bold text-primary-brand text-decoration-none">Log In</Link>
            </p>
        </div>
      </div>
    </div>
  );
}

export default Register;