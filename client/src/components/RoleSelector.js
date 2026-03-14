import React from 'react';
import { Link } from 'react-router-dom';

function RoleSelector() {
  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "linear-gradient(to right, #ff9966, #ff5e62)" }}>
      <div style={{ background: "white", padding: "50px", borderRadius: "20px", textAlign: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
        <h1 style={{ color: "#333", marginBottom: "30px" }}>Welcome to Mess Finder 🍱</h1>
        <p style={{ marginBottom: "40px", color: "#666" }}>Please select your role to continue:</p>
        
        <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
          <Link to="/home" style={{ textDecoration: "none" }}>
            <button style={{ padding: "15px 30px", fontSize: "1.2rem", background: "#e74c3c", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}>
              I am a Student 👨‍🎓
            </button>
          </Link>

          <Link to="/mess-dashboard" style={{ textDecoration: "none" }}>
            <button style={{ padding: "15px 30px", fontSize: "1.2rem", background: "#2c3e50", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}>
              I am a Mess Owner 👨‍🍳
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RoleSelector;