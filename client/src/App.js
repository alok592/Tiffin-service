import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- IMPORTS (Saare Pages yahan hone chahiye) ---
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import MyOrders from './components/MyOrders';
import MessDetails from './components/MessDetails';
import MessOwnerDashboard from './components/MessOwnerDashboard';
import StudentDashboard from './components/StudentDashboard';
import Explore from './components/Explore';
import About from './components/About';
import Contact from './components/Contact';

function App() {
  return (
    <Router>
      <Routes>
        {/* Website ka Main Page */}
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />

        {/* Login/Register Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* About & Contact Pages */}
        <Route path="/about" element={<About />} />      {/* 👈 YE LINE ZAROORI HAI */}
        <Route path="/contact" element={<Contact />} />

        {/* Functional Pages */}
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/mess/:id" element={<MessDetails />} />
        <Route path="/mess-dashboard" element={<MessOwnerDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;