import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import API from '../api'; // ✅ FIXED: moved to top level

// Map Icon Fix
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const foodImages = [
  "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/674574/pexels-photo-674574.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=600"
];

function Home() {
  const [providers, setProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllProviders = (lat = null, lng = null) => {
      let url = `${API}/api/providers`; // ✅ FIXED: uses Render backend URL
      if (lat && lng) url += `?lat=${lat}&lng=${lng}`;
      
      fetch(url)
        .then(res => res.json())
        .then(data => setProviders(Array.isArray(data) ? data : []))
        .catch(err => console.error(err));
    };

    // 1. Fetch Providers with Geolocation
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchAllProviders(latitude, longitude);
        },
        (error) => {
          console.warn("Geolocation denied or error. Fetching all providers.", error);
          fetchAllProviders();
        }
      );
    } else {
      fetchAllProviders();
    }

    // 2. Check User
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const checkIfOpen = (openingTime, closingTime) => {
    if (!openingTime || !closingTime) return true;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    const [openH, openM] = openingTime.split(':').map(Number);
    const openMinutes = openH * 60 + openM;
    
    const [closeH, closeM] = closingTime.split(':').map(Number);
    let closeMinutes = closeH * 60 + closeM;
    if (closeMinutes < openMinutes) closeMinutes += 24 * 60;
    
    let adjustedCurrent = currentMinutes;
    if (currentMinutes < openMinutes && closeMinutes > 24*60) adjustedCurrent += 24 * 60;

    return adjustedCurrent >= openMinutes && adjustedCurrent <= closeMinutes;
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  const filteredProviders = providers.filter(p => 
    p.messName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{backgroundColor: "#faf9f6", minHeight: "100vh"}} className="pb-5">
      
      {/* 🟢 NAVBAR */}
      <nav className="navbar navbar-expand-lg sticky-top px-lg-5 px-3 py-3" style={{backgroundColor: "transparent"}}>
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center gap-2 text-dark text-decoration-none" to="/">
              <div className="bg-warning text-white rounded p-1 d-flex align-items-center justify-content-center" style={{width: "35px", height: "35px", background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"}}>
                  <i className="fas fa-utensils fs-6"></i>
              </div>
              <span className="fw-bold mb-0 h4 brand-font m-0" style={{fontSize: "1.5rem"}}>MealConnect</span>
          </Link>
          
          <div className="d-flex align-items-center gap-4 ms-auto">
            <Link to="/" className="text-decoration-none fw-bold" style={{color: "#f97316", fontSize: "0.95rem"}}>Home</Link>
            <Link to="/explore" className="text-decoration-none text-muted fw-bold" style={{fontSize: "0.95rem"}}>Explore Messes</Link>
            
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
                <div className="d-flex gap-3 align-items-center">
                    <Link to="/login" className="btn btn-outline-dark fw-bold px-4 rounded-pill border-0" style={{fontSize: "0.95rem", backgroundColor: "#f3f4f6"}}>Log In</Link>
                    <Link to="/register" className="btn text-white fw-bold px-4 rounded-pill shadow-sm" style={{background: "linear-gradient(to right, #f59e0b, #d97706)", fontSize: "0.95rem"}}>Sign Up</Link>
                </div>
            )}
          </div>
        </div>
      </nav>

      {/* 🟢 MEALCONNECT HERO SECTION */}
      <div className="container" style={{paddingTop: "100px", paddingBottom: "100px"}}>
        <div className="row align-items-center g-5">
            <div className="col-lg-5 pe-lg-5 text-center text-lg-start">
                <span className="badge rounded-pill px-3 py-2 mb-4 fs-6" style={{backgroundColor: "#fef3c7", color: "#d97706"}}>
                    <i className="fas fa-utensils me-2"></i> #1 Student Meal Platform
                </span>
                <h1 className="display-4 fw-bold brand-font mb-4 lh-sm text-dark" style={{fontSize: "3.5rem"}}>
                    Affordable <span style={{color: "#f97316"}}>Home-Style</span> <br className="d-none d-lg-block"/>
                    Meals For Students
                </h1>
                <p className="fs-5 text-muted mb-5 pe-lg-4" style={{lineHeight: "1.6", fontSize: "1.1rem"}}>
                    Connect with local mess owners near your college. Browse menus, compare prices, and subscribe to daily meals — all in one place.
                </p>
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start mb-5">
                    <button className="btn text-white rounded-pill px-5 py-3 fs-5 shadow-sm d-flex align-items-center justify-content-center gap-2 border-0" style={{background: "linear-gradient(to right, #f59e0b, #d97706)", fontWeight: "600"}}>
                        Get Started <i className="fas fa-arrow-right fs-6"></i>
                    </button>
                    <Link to="/explore" className="btn btn-white rounded-pill px-5 py-3 fs-5 shadow-sm border-0 fw-bold text-dark bg-white text-decoration-none d-flex align-items-center justify-content-center">
                        Explore Messes
                    </Link>
                </div>
                
                <div className="d-flex flex-wrap gap-4 justify-content-center justify-content-lg-start small text-muted fw-bold">
                    <span className="d-flex align-items-center gap-2"><i className="fas fa-leaf text-success"></i> Veg Options</span>
                    <span className="d-flex align-items-center gap-2"><i className="fas fa-drumstick-bite text-danger"></i> Non-Veg Options</span>
                    <span className="d-flex align-items-center gap-2"><i className="fas fa-clock text-warning"></i> Flexible Plans</span>
                </div>
            </div>
            
            <div className="col-lg-7 position-relative mt-5 mt-lg-0">
                <div className="position-relative p-2 p-md-0">
                    <img src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=1600&auto=format&fit=crop" 
                         alt="Indian Thali" 
                         className="img-fluid rounded-4 shadow-lg w-100" 
                         style={{objectFit: "cover", height: "550px"}} />
                    
                    {/* Floating Price Badge */}
                    <div className="position-absolute bottom-0 start-0 bg-white rounded-4 shadow-lg p-3 d-flex align-items-center gap-3" 
                         style={{transform: "translate(-30px, 30px)", minWidth: "180px"}}>
                        <div className="text-white rounded-circle d-flex align-items-center justify-content-center" style={{width:"45px", height:"45px", background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"}}>
                            <i className="fas fa-rupee-sign fs-5"></i>
                        </div>
                        <div>
                            <p className="m-0 text-muted small fw-bold">Starting from</p>
                            <h4 className="m-0 fw-bold text-dark">₹2,000/mo</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* 🟢 HOW IT WORKS */}
      <div className="container" style={{paddingTop: "60px", paddingBottom: "100px"}}>
          <div className="text-center mb-5">
              <h2 className="brand-font fw-bold display-5 mb-3 text-dark">How It Works</h2>
              <p className="text-muted fs-5">Simple steps to find your perfect mess</p>
          </div>
          
          <div className="row g-4 justify-content-center">
              <div className="col-lg-3 col-md-6 text-center">
                  <div className="rounded-4 p-5 h-100 transition-all hover-effect bg-white shadow-sm border-0">
                      <div className="rounded-3 d-flex align-items-center justify-content-center mx-auto mb-4" style={{width: "60px", height: "60px", background: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)", color: "white"}}>
                          <i className="fas fa-location-crosshairs fs-4"></i>
                      </div>
                      <h5 className="fw-bold text-dark mb-3">Find Nearby Messes</h5>
                      <p className="text-muted m-0" style={{fontSize: "0.9rem", lineHeight: "1.6"}}>Discover affordable mess options close to your campus with real-time location.</p>
                  </div>
              </div>
              
              <div className="col-lg-3 col-md-6 text-center">
                  <div className="rounded-4 p-5 h-100 transition-all hover-effect bg-white shadow-sm border-0">
                      <div className="rounded-3 d-flex align-items-center justify-content-center mx-auto mb-4" style={{width: "60px", height: "60px", background: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)", color: "white"}}>
                          <i className="fas fa-utensils fs-4"></i>
                      </div>
                      <h5 className="fw-bold text-dark mb-3">Daily Menus</h5>
                      <p className="text-muted m-0" style={{fontSize: "0.9rem", lineHeight: "1.6"}}>View daily menus, special dishes, and meal schedules before subscribing.</p>
                  </div>
              </div>

              <div className="col-lg-3 col-md-6 text-center">
                  <div className="rounded-4 p-5 h-100 transition-all hover-effect bg-white shadow-sm border-0">
                      <div className="rounded-3 d-flex align-items-center justify-content-center mx-auto mb-4" style={{width: "60px", height: "60px", background: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)", color: "white"}}>
                          <i className="fas fa-users fs-4"></i>
                      </div>
                      <h5 className="fw-bold text-dark mb-3">Easy Subscriptions</h5>
                      <p className="text-muted m-0" style={{fontSize: "0.9rem", lineHeight: "1.6"}}>Subscribe monthly or try a trial pack — flexible plans for every student.</p>
                  </div>
              </div>

              <div className="col-lg-3 col-md-6 text-center">
                  <div className="rounded-4 p-5 h-100 transition-all hover-effect bg-white shadow-sm border-0">
                      <div className="rounded-3 d-flex align-items-center justify-content-center mx-auto mb-4" style={{width: "60px", height: "60px", background: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)", color: "white"}}>
                          <i className="fas fa-shield-alt fs-4"></i>
                      </div>
                      <h5 className="fw-bold text-dark mb-3">Verified Owners</h5>
                      <p className="text-muted m-0" style={{fontSize: "0.9rem", lineHeight: "1.6"}}>All mess owners are verified with photos, menus, and genuine reviews.</p>
                  </div>
              </div>
          </div>
      </div>

      {/* 🟢 POPULAR MESSES SECTION */}
      <div className="container" style={{paddingTop: "40px", paddingBottom: "80px"}}>
        <div className="d-flex justify-content-between align-items-end mb-5">
            <div>
                <h2 className="text-dark brand-font fw-bold m-0 mb-2" style={{fontSize: "2.5rem"}}>Popular Messes</h2>
                <p className="text-muted m-0 fs-5">Top-rated mess services near you</p>
            </div>
            <button className="btn btn-outline-dark rounded-pill fw-bold px-4 py-2 d-none d-md-flex align-items-center gap-2 border-2 hover-effect" style={{fontSize: "0.9rem"}}>
                View All <i className="fas fa-arrow-right"></i>
            </button>
        </div>
        
        <div className="row g-4">
            {filteredProviders.length > 0 ? filteredProviders.slice(0, 3).map((mess, index) => (
                <div className="col-lg-4 col-md-6" key={mess._id}>
                    <div className="card h-100 border-0 shadow-sm hover-effect bg-white" style={{borderRadius: "24px", overflow: "hidden"}}>
                        <div className="position-relative">
                            <div className="position-absolute top-0 start-0 m-3 z-1 d-flex gap-2">
                                {mess.isVeg && (
                                    <span className="badge bg-success shadow-sm rounded-pill px-3 py-2 d-flex align-items-center gap-1 border border-white border-opacity-25">
                                        <i className="fas fa-seedling"></i> Veg
                                    </span>
                                )}
                                {!mess.isVeg && (
                                    <span className="badge bg-danger shadow-sm rounded-pill px-3 py-2 d-flex align-items-center gap-1 border border-white border-opacity-25">
                                        <i className="fas fa-drumstick-bite"></i> Non-Veg
                                    </span>
                                )}
                            </div>

                            {mess.imageUrl ? (
                                <img 
                                    src={mess.imageUrl} 
                                    className="card-img-top" 
                                    alt={mess.messName} 
                                    style={{height: "260px", objectFit: "cover"}}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            ) : (
                                <div style={{height: "260px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "#94a3b8"}}>
                                    <i className="fas fa-image fs-1 mb-2"></i>
                                    <p className="small m-0">No Photo Added By Owner</p>
                                </div>
                            )}
                        </div>

                        <div className="card-body p-4 d-flex flex-column">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <div className="d-flex align-items-center gap-2">
                                    <h5 className="card-title fw-bold m-0 text-dark brand-font fs-4 text-truncate pe-2">{mess.messName}</h5>
                                    <i className="fas fa-check-circle text-primary" style={{ fontSize: "1rem" }} title="Verified Mess"></i>
                                </div>
                                <div className="d-flex align-items-center gap-1 bg-success text-white rounded-pill px-2 py-1 fw-bold" style={{fontSize: "0.8rem"}}>
                                    <i className="fas fa-star" style={{fontSize: "0.7rem"}}></i> {mess.rating || 4.5}
                                </div>
                            </div>
                            
                            <p className="text-muted m-0 mb-4 d-flex align-items-center gap-2" style={{fontSize: "0.85rem"}}>
                                <i className="fas fa-location-dot text-muted" style={{fontSize: "0.8rem"}}></i> 
                                {mess.address?.split(',')[0]} 
                                {mess.distance && <span className="opacity-50 px-1">•</span>} 
                                {mess.distance && <span>{mess.distance.toFixed(1)} km</span>}
                            </p>
                            
                            <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="m-0 fw-bold text-dark" style={{fontSize: "1.2rem"}}>₹{mess.subscriptionPlans?.monthly?.price || mess.pricePerMeal}<span className="text-muted fw-normal fs-6">/month</span></h5>
                                </div>
                                <Link to={`/mess/${mess._id}`} className="btn btn-outline-dark btn-sm rounded-pill px-3 fw-bold hover-effect border-2">
                                    View Menu
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )) : (
                <div className="text-center py-5">
                    <div className="mb-4">
                        <i className="fas fa-utensils fs-1 text-muted opacity-25"></i>
                    </div>
                    <p className="text-muted fs-5">No messes registered yet! 👨‍🍳 <br/>Be the first to add your mess to MealConnect.</p>
                </div>
            )}
        </div>
      </div>

      {/* 🟢 OWNER CTA SECTION */}
      <div className="container mb-5">
          <div className="rounded-5 p-5 p-lg-5 text-white position-relative overflow-hidden shadow-lg" style={{background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"}}>
              <div className="row align-items-center">
                  <div className="col-lg-8">
                      <h2 className="display-5 fw-bold brand-font mb-3">Own a Mess? List It Here!</h2>
                      <p className="fs-5 text-white text-opacity-90 mb-0" style={{maxWidth: "600px", lineHeight: "1.6"}}>
                          Reach thousands of students every day by listing your mess on MealConnect. Grow your business and manage subscriptions effortlessly.
                      </p>
                  </div>
                  <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
                      <Link to="/register" className="btn btn-light rounded-pill px-5 py-3 fs-5 fw-bold text-dark shadow-sm hover-effect border-0">
                          Register as Mess Owner
                      </Link>
                  </div>
              </div>
          </div>
      </div>

      {/* 🟢 MEALCONNECT FOOTER */}
      <footer className="footer mt-5 py-5 bg-dark text-white text-opacity-75" style={{backgroundColor: "#1e1e1e !important", borderTop: "1px solid rgba(255,255,255,0.05)"}}>
          <div className="container">
              <div className="row g-5">
                  <div className="col-lg-4 col-md-6 pe-lg-5">
                      <div className="d-flex align-items-center gap-2 mb-4 text-white">
                          <div className="bg-warning text-white rounded p-1 d-flex align-items-center justify-content-center" style={{width: "35px", height: "35px", background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"}}>
                              <i className="fas fa-utensils fs-6"></i>
                          </div>
                          <span className="fw-bold h4 brand-font m-0">MealConnect</span>
                      </div>
                      <p className="small lh-lg" style={{maxWidth: "300px"}}>Connecting students with affordable, homestyle meals from local messes. Quality food, every single day.</p>
                  </div>
                  
                  <div className="col-lg-2 col-md-3 col-6">
                      <h6 className="text-white fw-bold mb-4">For Students</h6>
                      <ul className="list-unstyled small d-flex flex-column gap-3">
                          <li><Link to="/explore" className="text-white text-opacity-75 text-decoration-none hover-effect-text">Find Messes</Link></li>
                          <li><Link to="/my-orders" className="text-white text-opacity-75 text-decoration-none hover-effect-text">My Orders</Link></li>
                          <li><Link to="/register" className="text-white text-opacity-75 text-decoration-none hover-effect-text">Sign Up</Link></li>
                      </ul>
                  </div>

                  <div className="col-lg-2 col-md-3 col-6">
                      <h6 className="text-white fw-bold mb-4">For Mess Owners</h6>
                      <ul className="list-unstyled small d-flex flex-column gap-3">
                          <li><Link to="/mess-dashboard" className="text-white text-opacity-75 text-decoration-none hover-effect-text">Dashboard</Link></li>
                          <li><Link to="/register" className="text-white text-opacity-75 text-decoration-none hover-effect-text">Register Your Mess</Link></li>
                      </ul>
                  </div>

                  <div className="col-lg-4 col-md-12 text-md-start text-lg-end">
                      <h6 className="text-white fw-bold mb-4">Contact</h6>
                      <p className="small m-0 mb-3 d-flex align-items-center justify-content-lg-end gap-2">
                          <i className="fas fa-envelope text-warning"></i> support@mealconnect.in
                      </p>
                      <p className="small m-0 mb-3 d-flex align-items-center justify-content-lg-end gap-2">
                          <i className="fas fa-phone text-warning"></i> +91 98765 43210
                      </p>
                  </div>
              </div>
              
              <div className="border-top border-white border-opacity-10 mt-5 pt-4 text-center small text-white text-opacity-50">
                  <p className="m-0">© {new Date().getFullYear()} MealConnect. All rights reserved.</p>
              </div>
          </div>
      </footer>
    </div>
  );
}

export default Home;
