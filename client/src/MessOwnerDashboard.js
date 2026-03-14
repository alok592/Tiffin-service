import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function MessOwnerDashboard() {
  const [isOnline, setIsOnline] = useState(true);
  const [orders, setOrders] = useState([]); // ✅ Empty array initially

  const messName = "Saoji Asli Taste"; 
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Order from ${messName}`;

  // ✅ 1. SERVER SE ORDERS LOAD KARNA
  useEffect(() => {
    fetchOrders();
    // Har 5 second mein refresh karein (Real-time feel ke liye)
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = () => {
    fetch('http://localhost:5000/api/orders')
      .then(res => res.json())
      .then(data => {
        // Sirf is mess ke orders filter karein (agar multiple mess hon)
        // Abhi ke liye hum assume kar rahe hain ye owner sab dekh sakta hai demo me
        setOrders(data);
      })
      .catch(err => console.error("Error fetching orders:", err));
  };

  // ✅ 2. STATUS UPDATE KARNA (Accept/Reject)
  const handleStatus = async (id, newStatus) => {
    try {
      await fetch(`http://localhost:5000/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchOrders(); // List update karein
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#f0f2f5", minHeight: "100vh", paddingBottom: "50px" }}>
      
      {/* HEADER */}
      <div style={{ background: "white", padding: "15px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <div>
            <h2 style={{ margin: 0, color: "#333" }}>{messName} Panel</h2>
            <p style={{ margin: 0, fontSize: "12px", color: "green" }}>● Live Status: {isOnline ? "Online" : "Offline"}</p>
        </div>
        <button onClick={() => setIsOnline(!isOnline)} style={{ padding: "8px 20px", borderRadius: "20px", border: "none", fontWeight: "bold", cursor: "pointer", background: isOnline ? "#27ae60" : "#e74c3c", color: "white" }}>{isOnline ? "🟢 ON" : "🔴 OFF"}</button>
      </div>

      <div style={{ maxWidth: "800px", margin: "20px auto", padding: "0 15px", display: "flex", gap: "20px", flexWrap: "wrap" }}>
        
        {/* LEFT COLUMN */}
        <div style={{ flex: 2, minWidth: "300px" }}>
            {/* Live Orders */}
            <h3 style={{ color: "#555" }}>🔔 Live Orders ({orders.length})</h3>
            
            {orders.length === 0 ? <p>No orders yet...</p> : orders.map(order => (
                <div key={order._id} style={{ background: "white", padding: "20px", borderRadius: "10px", marginBottom: "15px", borderLeft: order.status === "Pending" ? "5px solid orange" : (order.status === "Accepted" ? "5px solid green" : "5px solid red") }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <h4 style={{ margin: 0 }}>{order.customerName} <small style={{fontWeight: "normal", color: "#777"}}>({order.mobile})</small></h4>
                        <span style={{ fontWeight: "bold", color: "#333" }}>₹{order.price}</span>
                    </div>
                    <p style={{ color: "#777", margin: "5px 0 15px 0" }}>{order.items}</p>
                    
                    {order.status === "Pending" ? (
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button onClick={() => handleStatus(order._id, "Accepted")} style={{ flex: 1, padding: "10px", background: "#27ae60", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>✅ Accept</button>
                            <button onClick={() => handleStatus(order._id, "Rejected")} style={{ flex: 1, padding: "10px", background: "#e74c3c", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>❌ Reject</button>
                        </div>
                    ) : (
                        <div style={{ background: order.status === "Accepted" ? "#e8f8f5" : "#fcebea", color: order.status === "Accepted" ? "#27ae60" : "#c0392b", padding: "10px", textAlign: "center", borderRadius: "5px", fontWeight: "bold" }}>
                            {order.status === "Accepted" ? "✅ Order Accepted & Preparing..." : "❌ Order Rejected"}
                        </div>
                    )}
                </div>
            ))}
        </div>

        {/* RIGHT COLUMN (QR & MENU) */}
        <div style={{ flex: 1, minWidth: "250px" }}>
            <div style={{ background: "white", padding: "20px", borderRadius: "10px", textAlign: "center", marginBottom: "20px", border: "1px solid #ddd" }}>
                <h3>📱 My Mess QR</h3>
                <img src={qrCodeUrl} alt="Mess QR" style={{ width: "150px", height: "150px", marginBottom: "10px" }} />
                <p style={{ fontSize: "12px", color: "#777" }}>Scan to open Menu</p>
                <button onClick={() => window.print()} style={{ padding: "8px 15px", background: "#333", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>🖨️ Print QR</button>
            </div>
            
            <Link to="/" style={{ display: "block", textAlign: "center", marginTop: "20px", color: "#e74c3c", textDecoration: "none" }}>Logout</Link>
        </div>

      </div>
    </div>
  );
}

export default MessOwnerDashboard;