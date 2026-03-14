import React from 'react';
import { Link } from 'react-router-dom';

function RoleSelector() {
  const containerStyle = {
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    height: "100vh", background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)", color: "white"
  };

  const cardStyle = {
    background: "white", padding: "40px", borderRadius: "15px", boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
    textAlign: "center", color: "#333", width: "320px"
  };

  const btnStyle = {
    display: "block", width: "100%", padding: "15px", margin: "15px 0", borderRadius: "8px",
    border: "none", cursor: "pointer", fontSize: "16px", fontWeight: "bold", textDecoration: "none",
    textAlign: "center", transition: "0.3s"
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: "10px", fontSize: "2.5rem" }}>🍱 Zomato Tiffin</h1>
      <p style={{ marginBottom: "30px", opacity: "0.8", fontSize: "1.2rem" }}>Who are you?</p>
      
      <div style={cardStyle}>
        
        {/* 1. Admin */}
        <Link to="/admin" style={{ ...btnStyle, background: "#2c3e50", color: "white" }}>
           👨‍💻 Website Admin
        </Link>

        {/* 2. Mess Owner */}
        <Link to="/mess-dashboard" style={{ ...btnStyle, background: "#e67e22", color: "white" }}>
           👨‍🍳 Mess Owner
        </Link>

        {/* 3. User (Ab ye '/home' par jayega) */}
        <Link to="/home" style={{ ...btnStyle, background: "#27ae60", color: "white" }}>
           😋 Customer / User
        </Link>

      </div>
    </div>
  );
}

export default RoleSelector;