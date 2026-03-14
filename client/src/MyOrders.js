import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate('/login');
      return;
    }

    // Orders fetch karo
    fetch('http://localhost:5000/api/orders')
      .then(res => res.json())
      .then(data => {
        // Sirf is user ke orders filter karo (Mobile/Email match karke)
        // Note: Real app mein ye filtering Backend pe honi chahiye
        const myOrders = data.filter(order => order.mobile === user.email);
        setOrders(myOrders);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [navigate]);

  if (loading) return <div style={{ textAlign: "center", marginTop: "50px", fontSize: "1.2rem" }}>⏳ Loading your orders...</div>;

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "40px 20px" }}>
      
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ color: "#2c3e50", marginBottom: "30px", borderBottom: "3px solid #d35400", display: "inline-block", paddingBottom: "10px" }}>
          📦 My Order History
        </h1>

        {orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px", background: "white", borderRadius: "15px", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
            <h3>No orders yet  hunger? 🍕</h3>
            <p style={{ color: "#777" }}>Looks like you haven't ordered any tiffin yet.</p>
            <button onClick={() => navigate('/')} style={{ marginTop: "20px", padding: "10px 25px", background: "#d35400", color: "white", border: "none", borderRadius: "30px", fontSize: "1rem", cursor: "pointer", fontWeight: "bold" }}>
              Order Food Now
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "20px" }}>
            {orders.map((order) => (
              <div key={order._id} style={{ background: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: `6px solid ${getStatusColor(order.status)}` }}>
                
                {/* Left: Info */}
                <div>
                  <h3 style={{ margin: "0 0 5px 0", color: "#333" }}>{order.messName}</h3>
                  <p style={{ margin: 0, color: "#555", fontSize: "0.95rem" }}>🍛 {order.items}</p>
                  <p style={{ margin: "5px 0 0 0", color: "#888", fontSize: "0.85rem" }}>
                    📅 {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
                  </p>
                </div>

                {/* Right: Price & Status */}
                <div style={{ textAlign: "right" }}>
                  <h3 style={{ margin: "0 0 10px 0", color: "#2c3e50" }}>₹{order.price}</h3>
                  <span style={{ 
                    padding: "6px 15px", 
                    borderRadius: "20px", 
                    fontSize: "0.85rem", 
                    fontWeight: "bold", 
                    backgroundColor: getStatusBg(order.status), 
                    color: getStatusColor(order.status) 
                  }}>
                    {order.status === 'Pending' ? '⏳ Pending' : order.status === 'Accepted' ? '✅ Accepted' : '❌ Rejected'}
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- HELPER FUNCTIONS FOR COLORS ---
const getStatusColor = (status) => {
  if (status === "Accepted") return "#27ae60"; // Green
  if (status === "Rejected") return "#c0392b"; // Red
  return "#f39c12"; // Orange (Pending)
};

const getStatusBg = (status) => {
  if (status === "Accepted") return "#eafaf1";
  if (status === "Rejected") return "#fdedec";
  return "#fef5e7";
};

export default MyOrders;