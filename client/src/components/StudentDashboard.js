import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api'; // ✅ FIXED: import API

function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [nearbyMesses, setNearbyMesses] = useState([]);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.role !== 'student') {
      navigate('/login');
      return;
    }
    setUser(storedUser);

    // Fetch Registered Messes
    fetch(`${API}/api/providers`) // ✅ FIXED
      .then(res => res.json())
      .then(data => setNearbyMesses(data))
      .catch(err => console.error(err));

    // Fetch Real Active Subscription
    fetch(`${API}/api/orders`) // ✅ FIXED
      .then(res => res.json())
      .then(data => {
          const studentOrders = data.filter(o => o.mobile === storedUser.email);
          setOrders(studentOrders);
          
          const latestActive = studentOrders.find(o => o.status === 'Accepted');
          if (latestActive) {
            setActiveSubscription({
              messName: latestActive.messName,
              plan: latestActive.planType || "Monthly Plan",
              status: "Active",
              mealsRemaining: latestActive.planType === 'Trial' ? 1 : latestActive.planType === 'Weekly' ? 7 : 28
            });
          }
      })
      .catch(err => console.error(err));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate('/login');
  };

  return (
    <div style={{ backgroundColor: "#faf9f6", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      {/* 🟢 Student Header */}
      <header style={{ backgroundColor: "white", padding: "15px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee", sticky: "top" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ background: "#f59e0b", color: "white", width: "35px", height: "35px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px" }}>
                <i className="fas fa-utensils"></i>
            </div>
            <h1 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "700", color: "#1e1e1e" }}>MealConnect</h1>
          </Link>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <span style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151" }}>Welcome, {user?.name} 👋</span>
            <button onClick={handleLogout} style={{ background: "#f3f4f6", border: "none", padding: "8px 15px", borderRadius: "8px", color: "#4b5563", cursor: "pointer", fontWeight: "600", fontSize: "0.85rem" }}>Logout</button>
        </div>
      </header>

      <main style={{ padding: "40px" }}>
        <div className="row g-4">
          
          {/* 🟢 LEFT COLUMN: Subscription & Stats */}
          <div className="col-lg-4">
            <div style={cardStyle}>
              <h3 style={sectionTitleStyle}>Current Subscription</h3>
              {activeSubscription ? (
                <div style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", padding: "25px", borderRadius: "20px", color: "white", marginBottom: "20px" }}>
                  <p style={{ margin: 0, opacity: 0.8, fontSize: "0.85rem", fontWeight: "600" }}>SUBSCRIBED TO</p>
                  <h4 style={{ margin: "5px 0 15px 0", fontWeight: "700" }}>{activeSubscription.messName}</h4>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                    <span>{activeSubscription.plan}</span>
                    <span style={{ background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: "5px" }}>{activeSubscription.status}</span>
                  </div>
                  <hr style={{ borderColor: "rgba(255,255,255,0.2)" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.8 }}>Meals Remaining</p>
                        <h5 style={{ margin: 0, fontWeight: "700" }}>{activeSubscription.mealsRemaining}</h5>
                    </div>
                    <Link to="/my-orders" style={{ color: "white", fontSize: "0.85rem", fontWeight: "700", textDecoration: "none", background: "rgba(0,0,0,0.1)", padding: "8px 12px", borderRadius: "10px" }}>View Pass</Link>
                  </div>
                </div>
              ) : (
                <p style={{ color: "#6b7280" }}>No active subscription. <Link to="/" style={{ color: "#f59e0b" }}>Find a mess</Link></p>
              )}

              <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "20px" }}>
                <h5 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "15px" }}>Quick Actions</h5>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <button style={actionBtnStyle}><i className="fas fa-phone-alt me-2"></i> Contact Mess</button>
                    <Link to="/" style={{ ...actionBtnStyle, textDecoration: "none", display: "flex", alignItems: "center" }}><i className="fas fa-search me-2"></i> Change Mess</Link>
                    <button style={actionBtnStyle}><i className="fas fa-history me-2"></i> Pay Dues</button>
                    <button style={actionBtnStyle}><i className="fas fa-star me-2"></i> Rate Mess</button>
                </div>
              </div>
            </div>
          </div>

          {/* 🟢 RIGHT COLUMN: Nearby & Orders */}
          <div className="col-lg-8">
            {/* Nearby Messes */}
            <div style={{ ...cardStyle, marginBottom: "30px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={sectionTitleStyle}>Explore Messes</h3>
                <Link to="/" style={{ color: "#f59e0b", fontSize: "0.85rem", fontWeight: "700", textDecoration: "none" }}>Filters <i className="fas fa-sliders ms-1"></i></Link>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "25px" }}>
                {nearbyMesses.length > 0 ? nearbyMesses.map(mess => (
                  <div key={mess._id} style={zomatoCardStyle} className="hover-effect">
                    <div style={{ position: 'relative' }}>
                      {mess.imageUrl ? (
                        <img src={mess.imageUrl} 
                          alt={mess.messName} style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }} />
                      ) : (
                        <div style={{ width: "100%", height: "200px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "#94a3b8", borderRadius: "20px" }}>
                          <i className="fas fa-image fs-2 mb-2"></i>
                          <p style={{ fontSize: "0.7rem", margin: 0 }}>No Photo Added</p>
                        </div>
                      )}
                      <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(255,255,255,0.95)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', color: '#1e1e1e', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                        30-40 min
                      </div>
                      {mess.isVeg && (
                        <div style={{ position: 'absolute', top: '12px', left: '12px', background: '#10b981', color: 'white', padding: '4px 12px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                          Pure Veg
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '15px 5px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h5 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "700", color: '#1e1e1e' }}>{mess.messName}</h5>
                          <i className="fas fa-check-circle text-primary" style={{ fontSize: '0.9rem' }} title="Verified Mess"></i>
                        </div>
                        <div style={{ background: '#166534', color: 'white', padding: '3px 8px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {mess.rating || 4.5} <i className="fas fa-star" style={{ fontSize: '0.7rem' }}></i>
                        </div>
                      </div>
                      <p style={{ margin: '0 0 12px 0', fontSize: "0.9rem", color: "#6b7280", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        North Indian • Thali • Homestyle • Affordable
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '12px' }}>
                        <div>
                          <span style={{ fontSize: '1rem', fontWeight: '800', color: '#1e1e1e' }}>₹{mess.subscriptionPlans?.monthly?.price || mess.pricePerMeal}</span>
                          <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '600' }}>/month</span>
                        </div>
                        <Link to={`/mess/${mess._id}`} style={{ textDecoration: 'none', color: '#f59e0b', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          View Menu <i className="fas fa-arrow-right" style={{ fontSize: '0.75rem' }}></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="col-12 text-center py-5">
                    <i className="fas fa-utensils fs-1 text-muted opacity-25 mb-3"></i>
                    <p className="text-muted">No registered messes found in your area.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Orders */}
            <div style={cardStyle}>
              <h3 style={sectionTitleStyle}>Recent Meal Activity</h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                            <th style={tableHeaderStyle}>Date</th>
                            <th style={tableHeaderStyle}>Mess Name</th>
                            <th style={tableHeaderStyle}>Meal Type</th>
                            <th style={tableHeaderStyle}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? orders.map(order => (
                            <tr key={order._id} style={{ borderBottom: "1px solid #fafafa" }}>
                                <td style={tableCellStyle}>{new Date(order.date).toLocaleDateString()}</td>
                                <td style={tableCellStyle}><strong>{order.messName || "Annapurna Mess"}</strong></td>
                                <td style={tableCellStyle}>{order.items || "Daily Thali"}</td>
                                <td style={tableCellStyle}>
                                    <span style={{ ...statusBadgeStyle, backgroundColor: order.status === 'Accepted' ? '#dcfce7' : '#fef3c7', color: order.status === 'Accepted' ? '#166534' : '#92400e' }}>
                                        {order.status || "Pending"}
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="4" style={{ padding: "20px", textAlign: "center", color: "#9ca3af" }}>No recent activity found.</td></tr>
                        )}
                    </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

// --- STYLES ---
const cardStyle = { background: "white", padding: "30px", borderRadius: "24px", boxShadow: "0 10px 25px rgba(0,0,0,0.02)" };
const sectionTitleStyle = { fontFamily: "'Playfair Display', serif", fontWeight: "700", fontSize: "1.25rem", color: "#1e1e1e", marginBottom: "25px", margin: 0 };
const zomatoCardStyle = { cursor: 'pointer', transition: 'transform 0.3s' };
const actionBtnStyle = { background: "#faf9f6", border: "1px solid #f3f4f6", padding: "10px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "700", color: "#4b5563", cursor: "pointer", textAlign: "left" };
const tableHeaderStyle = { padding: "15px 10px", textAlign: "left", fontSize: "0.8rem", color: "#6b7280", fontWeight: "600" };
const tableCellStyle = { padding: "15px 10px", fontSize: "0.85rem", color: "#374151" };
const statusBadgeStyle = { padding: "4px 10px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: "700" };

export default StudentDashboard;
