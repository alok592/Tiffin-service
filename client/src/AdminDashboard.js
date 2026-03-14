import React from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  // --- STYLES ---
  const wrapperStyle = { display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#f4f6f9" };
  const sidebarStyle = { width: "250px", background: "#2c3e50", color: "white", padding: "20px", display: "flex", flexDirection: "column" };
  const mainStyle = { flex: 1, padding: "30px" };
  const cardStyle = { background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", flex: 1 };
  
  return (
    <div style={wrapperStyle}>
      
      {/* 🟢 1. LEFT SIDEBAR */}
      <div style={sidebarStyle}>
        <h2 style={{ marginBottom: "40px", color: "#ecf0f1" }}>🍱 Zomato Admin</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <span style={{ padding: "10px", background: "#34495e", borderRadius: "5px", cursor: "pointer" }}>📊 Dashboard</span>
            <span style={{ padding: "10px", cursor: "pointer", opacity: 0.8 }}>👥 Manage Users</span>
            <span style={{ padding: "10px", cursor: "pointer", opacity: 0.8 }}>🏪 All Messes</span>
            <span style={{ padding: "10px", cursor: "pointer", opacity: 0.8 }}>💰 Revenue</span>
            <Link to="/" style={{ marginTop: "auto", color: "#e74c3c", textDecoration: "none", fontWeight: "bold" }}>⬅ Logout</Link>
        </div>
      </div>

      {/* 🟢 2. MAIN CONTENT */}
      <div style={mainStyle}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
            <h1 style={{ margin: 0, color: "#2c3e50" }}>Dashboard Overview</h1>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ background: "#dff9fb", padding: "5px 15px", borderRadius: "20px", color: "#2c3e50" }}>Admin: <strong>Arpita</strong></span>
            </div>
        </div>

        {/* Stats Cards */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
            <div style={cardStyle}>
                <p style={{ color: "#7f8c8d", margin: 0 }}>Total Revenue</p>
                <h2 style={{ margin: "5px 0", color: "#27ae60" }}>₹ 1,24,500</h2>
                <small style={{ color: "green" }}>▲ 12% from last month</small>
            </div>
            <div style={cardStyle}>
                <p style={{ color: "#7f8c8d", margin: 0 }}>Active Messes</p>
                <h2 style={{ margin: "5px 0", color: "#2980b9" }}>15</h2>
                <small>Nagpur Region</small>
            </div>
            <div style={cardStyle}>
                <p style={{ color: "#7f8c8d", margin: 0 }}>Total Orders Today</p>
                <h2 style={{ margin: "5px 0", color: "#8e44ad" }}>142</h2>
                <small style={{ color: "orange" }}>• Live Updates</small>
            </div>
        </div>

        {/* Fake Graph Representation (CSS Bars) */}
        <div style={{ ...cardStyle, marginBottom: "30px" }}>
            <h3>📈 Monthly Orders Graph</h3>
            <div style={{ display: "flex", alignItems: "flex-end", height: "150px", gap: "20px", marginTop: "20px" }}>
                {[40, 60, 30, 80, 50, 90, 70, 100].map((h, i) => (
                    <div key={i} style={{ flex: 1, background: i % 2 === 0 ? "#3498db" : "#2ecc71", height: `${h}%`, borderRadius: "5px 5px 0 0", opacity: 0.8 }}></div>
                ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", color: "#7f8c8d", fontSize: "12px" }}>
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
            </div>
        </div>

        {/* Recent Mess Table */}
        <div style={cardStyle}>
            <h3>Recent Joined Messes</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px" }}>
                <thead>
                    <tr style={{ background: "#f8f9fa", textAlign: "left", color: "#7f8c8d" }}>
                        <th style={{ padding: "12px" }}>Mess Name</th>
                        <th style={{ padding: "12px" }}>Owner</th>
                        <th style={{ padding: "12px" }}>Status</th>
                        <th style={{ padding: "12px" }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={{ borderBottom: "1px solid #eee" }}>
                        <td style={{ padding: "12px" }}>Saoji Asli Taste</td>
                        <td>Raju Bhau</td>
                        <td><span style={{ background: "#e8f8f5", color: "#27ae60", padding: "4px 8px", borderRadius: "10px", fontSize: "12px" }}>Active</span></td>
                        <td><button style={{ border: "none", color: "red", background: "none", cursor: "pointer" }}>Block</button></td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #eee" }}>
                        <td style={{ padding: "12px" }}>Varhadi Thaat</td>
                        <td>Anjali Tai</td>
                        <td><span style={{ background: "#fef9e7", color: "#f1c40f", padding: "4px 8px", borderRadius: "10px", fontSize: "12px" }}>Pending</span></td>
                        <td><button style={{ border: "none", color: "blue", background: "none", cursor: "pointer" }}>Approve</button></td>
                    </tr>
                </tbody>
            </table>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;