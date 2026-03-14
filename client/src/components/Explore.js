import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Explore() {
  const [messes, setMesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Check User
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    // 2. Fetch All Messes
    fetch('http://localhost:5000/api/providers')
      .then(res => res.json())
      .then(data => {
        setMesses(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  const filteredMesses = messes.filter(mess => 
    mess.messName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mess.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: "#faf9f6", minHeight: "100vh" }}>
      {/* 🟢 NAVBAR */}
      <nav className="navbar navbar-expand-lg sticky-top px-lg-5 px-3 py-3" style={{ backgroundColor: "white", borderBottom: "1px solid #fed7aa" }}>
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center gap-2 text-dark text-decoration-none" to="/">
            <div className="bg-warning text-white rounded p-1 d-flex align-items-center justify-content-center" style={{ width: "35px", height: "35px", background: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)" }}>
              <i className="fas fa-utensils fs-6"></i>
            </div>
            <span className="fw-bold mb-0 h4 m-0" style={{ fontSize: "1.5rem", color: "#431407" }}>MealConnect</span>
          </Link>

          <div className="d-flex align-items-center gap-4 ms-auto">
            <Link to="/" className="text-decoration-none text-muted fw-bold" style={{ fontSize: "0.95rem" }}>Home</Link>
            <Link to="/explore" className="text-decoration-none fw-bold" style={{ color: "#ea580c", fontSize: "0.95rem" }}>Explore Messes</Link>
            
            {user ? (
              <div className="d-flex gap-3 align-items-center">
                {user.role === 'owner' ? (
                  <Link to="/mess-dashboard" className="btn btn-outline-dark btn-sm fw-bold rounded-pill px-4 shadow-sm border-2">Dashboard</Link>
                ) : (
                  <Link to="/student-dashboard" className="btn btn-outline-dark btn-sm fw-bold rounded-pill px-4 shadow-sm border-2">
                    <i className="fas fa-user-circle me-2"></i> {user.name}'s Profile
                  </Link>
                )}
                <button onClick={handleLogout} className="btn btn-light btn-sm rounded-pill px-3 fw-bold border shadow-sm">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-warning btn-sm rounded-pill px-4 fw-bold text-white shadow-sm" style={{ background: "#ea580c", border: "none" }}>Login</Link>
            )}
          </div>
        </div>
      </nav>

      {/* 🟠 SEARCH SECTION */}
      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: "800", color: "#431407", fontSize: "2.5rem" }}>Explore All Messes</h1>
          <p className="text-muted">Find the best home-style food near you</p>
          
          <div className="mt-4 mx-auto" style={{ maxWidth: "600px", position: "relative" }}>
            <i className="fas fa-search position-absolute" style={{ left: "20px", top: "50%", transform: "translateY(-50%)", color: "#ea580c" }}></i>
            <input 
              type="text" 
              placeholder="Search by mess name or area..." 
              className="form-control shadow-sm" 
              style={{ padding: "15px 50px", borderRadius: "15px", border: "1px solid #fed7aa", fontSize: "1.1rem" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 📋 MESS GRID */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status"></div>
          </div>
        ) : (
          <div className="row g-4">
            {filteredMesses.length > 0 ? filteredMesses.map(mess => (
              <div key={mess._id} className="col-lg-4 col-md-6">
                <Link to={`/mess/${mess._id}`} className="text-decoration-none">
                  <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 hover-effect" style={{ transition: "transform 0.3s" }}>
                    <div className="position-relative">
                      {mess.imageUrl ? (
                        <img 
                          src={mess.imageUrl} 
                          alt={mess.messName} 
                          style={{ width: "100%", height: "220px", objectFit: "cover" }} 
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div style={{ width: "100%", height: "220px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "#94a3b8" }}>
                          <i className="fas fa-image fs-1 mb-2"></i>
                          <p className="small m-0">No Photo Added By Owner</p>
                        </div>
                      )}
                      <div className="position-absolute top-0 end-0 m-3">
                        <span className="badge bg-white text-dark shadow-sm p-2 px-3 rounded-pill fw-bold" style={{ fontSize: "0.85rem" }}>
                          <i className="fas fa-star text-warning me-1"></i> {mess.rating || 4.5}
                        </span>
                      </div>
                      {mess.isVeg && (
                        <div className="position-absolute top-0 start-0 m-3">
                          <span className="badge bg-success shadow-sm p-2 px-3 rounded-pill fw-bold" style={{ fontSize: "0.75rem", textTransform: "uppercase" }}>
                            Pure Veg
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <h5 className="fw-bold m-0" style={{ color: "#431407", fontSize: "1.25rem" }}>{mess.messName}</h5>
                        <i className="fas fa-check-circle text-primary" title="Verified Mess"></i>
                      </div>
                      <p className="text-muted small mb-3">
                        <i className="fas fa-map-marker-alt me-2 text-danger"></i> {mess.address}
                      </p>
                      <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                        <div>
                          <span className="text-muted small">Starting from</span>
                          <h4 className="fw-bold m-0" style={{ color: "#ea580c" }}>₹{mess.subscriptionPlans?.monthly?.price || mess.pricePerMeal}/mo</h4>
                        </div>
                        <button className="btn btn-warning rounded-pill px-4 fw-bold text-white shadow-sm" style={{ background: "#ea580c", border: "none" }}>
                          View Menu
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )) : (
              <div className="text-center py-5 w-100">
                <i className="fas fa-utensils fs-1 text-muted opacity-25 mb-3"></i>
                <h3 className="text-muted">No messes found matching your search.</h3>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Explore;
