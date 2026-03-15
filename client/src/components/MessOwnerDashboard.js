import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api'; // ✅ FIXED: import API

// --- STYLES ---
const statCardStyle = { background: "white", padding: "24px", borderRadius: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" };
const comingSoonBadge = { backgroundColor: "#fff7ed", color: "#f97316", padding: "4px 10px", borderRadius: "8px", fontSize: "0.7rem", fontWeight: "600" };
const totalBadge = { backgroundColor: "#fff7ed", color: "#f97316", padding: "4px 10px", borderRadius: "8px", fontSize: "0.7rem", fontWeight: "600" };
const activeTabStyle = { padding: "10px 20px", borderRadius: "10px", background: "white", border: "1px solid #fed7aa", fontWeight: "600", color: "#ea580c", cursor: "pointer", boxShadow: "0 2px 5px rgba(234, 88, 12, 0.1)" };
const inactiveTabStyle = { padding: "10px 20px", borderRadius: "10px", background: "#fef3c7", border: "none", fontWeight: "600", color: "#92400e", cursor: "pointer" };
const formInputStyle = { flex: 1, padding: "12px 20px", borderRadius: "12px", border: "1px solid #fed7aa", backgroundColor: "#fffcf0", fontSize: "1rem", outline: "none" };
const selectStyle = { padding: "12px 15px", borderRadius: "12px", border: "1px solid #fed7aa", backgroundColor: "white", fontWeight: "600", color: "#92400e", cursor: "pointer", outline: "none" };
const addBtnStyle = { padding: "12px 25px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)", color: "white", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 12px rgba(234, 88, 12, 0.2)" };
const labelStyle = { display: "block", marginBottom: "8px", fontWeight: "600", color: "#92400e", fontSize: "0.9rem" };
const tableHeaderStyle = { padding: "15px 10px", textAlign: "left", fontSize: "0.85rem", color: "#92400e", fontWeight: "700", borderBottom: "2px solid #fed7aa" };
const tableCellStyle = { padding: "15px 10px", fontSize: "0.9rem", color: "#431407", verticalAlign: "middle" };

function MessOwnerDashboard() {
  const [activeTab, setActiveTab] = useState("schedule");
  const [orders, setOrders] = useState([]);
  const [myMess, setMyMess] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const [selectedScheduleDay, setSelectedScheduleDay] = useState("Monday");
  const [scheduleItem, setScheduleItem] = useState("");

  const [registrationForm, setRegistrationForm] = useState({
    messName: '', price: '', address: '', phone: '', isVeg: 'true'
  });

  const [plansForm, setPlansForm] = useState({
    trial: '',
    weekly: '',
    monthly: ''
  });

  const [profileForm, setProfileForm] = useState({
    messName: '',
    address: '',
    phone: '',
    imageUrl: ''
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.role !== 'owner') {
      navigate('/login');
      return;
    }
    setUser(storedUser);
    fetchMyMess(storedUser.email);
    fetchOrders();
  }, [navigate]);

  const fetchOrders = () => {
    fetch(`${API}/api/orders`) // ✅ FIXED
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error("Orders fetch error:", err));
  };

  const fetchMyMess = (userEmail) => {
    fetch(`${API}/api/providers`) // ✅ FIXED
      .then(res => res.json())
      .then(data => {
        const found = data.find(p => p.email === userEmail);
        if (found) {
          setMyMess(found);
          if (found.subscriptionPlans) {
            setPlansForm({
              trial: found.subscriptionPlans.trial.price,
              weekly: found.subscriptionPlans.weekly.price,
              monthly: found.subscriptionPlans.monthly.price
            });
          }
          setProfileForm({
            messName: found.messName || '',
            address: found.address || '',
            phone: found.phone || '',
            imageUrl: found.imageUrl || ''
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        messName: profileForm.messName.trim(),
        address: profileForm.address.trim(),
        phone: profileForm.phone.trim(),
        imageUrl: profileForm.imageUrl.trim()
      };

      const res = await fetch(`${API}/api/providers/${myMess._id}`, { // ✅ FIXED
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      
      if (res.ok) {
        const updatedProvider = await res.json();
        setMyMess(updatedProvider);
        alert("✅ Mess Profile & Photo updated successfully!");
      } else {
        alert("❌ Failed to update profile.");
      }
    } catch (err) { 
      console.error("Profile Update Error:", err);
      alert("⚠️ Server error. Could not update profile.");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert("⚠️ Photo is too large! Please select an image smaller than 1MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileForm({ ...profileForm, imageUrl: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleUpdatePlans = async (e) => {
    e.preventDefault();
    const updatedPlans = {
      trial: { price: Number(plansForm.trial), duration: "1 Day" },
      weekly: { price: Number(plansForm.weekly), duration: "7 Days" },
      monthly: { price: Number(plansForm.monthly), duration: "30 Days" }
    };

    try {
      const res = await fetch(`${API}/api/providers/${myMess._id}`, { // ✅ FIXED
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionPlans: updatedPlans })
      });
      if (res.ok) {
        setMyMess({ ...myMess, subscriptionPlans: updatedPlans });
        alert("✅ Subscription plans updated!");
      }
    } catch (err) { console.error(err); }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API}/api/orders/${orderId}`, { // ✅ FIXED
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        alert(`Order ${newStatus}!`);
        fetchOrders();
      }
    } catch (err) { console.error(err); }
  };

  const handleUpdateSchedule = async (e) => {
    e.preventDefault();
    if (!scheduleItem.trim() || !myMess) return;

    const currentDayMenu = myMess.weeklySchedule?.[selectedScheduleDay] || [];
    const updatedDayMenu = [...currentDayMenu, scheduleItem];
    
    const updatedSchedule = {
      ...(myMess.weeklySchedule || {}),
      [selectedScheduleDay]: updatedDayMenu
    };

    try {
      const res = await fetch(`${API}/api/providers/${myMess._id}`, { // ✅ FIXED
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weeklySchedule: updatedSchedule })
      });
      if (res.ok) {
        setMyMess({ ...myMess, weeklySchedule: updatedSchedule });
        setScheduleItem("");
        alert(`✅ ${selectedScheduleDay} menu updated!`);
      }
    } catch (err) { console.error(err); }
  };

  const deleteScheduleItem = async (day, index) => {
    if (!myMess || !myMess.weeklySchedule?.[day]) return;
    
    const updatedDayMenu = myMess.weeklySchedule[day].filter((_, i) => i !== index);
    const updatedSchedule = { ...myMess.weeklySchedule, [day]: updatedDayMenu };

    try {
      const res = await fetch(`${API}/api/providers/${myMess._id}`, { // ✅ FIXED
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weeklySchedule: updatedSchedule })
      });
      if (res.ok) {
        setMyMess({ ...myMess, weeklySchedule: updatedSchedule });
      }
    } catch (err) { console.error(err); }
  };

  const handlePhotoUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const photoUrl = URL.createObjectURL(file); 
    try {
      const res = await fetch(`${API}/api/providers/${myMess._id}`, { // ✅ FIXED
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: photoUrl })
      });
      if (res.ok) {
        setMyMess({ ...myMess, imageUrl: photoUrl });
        alert("📸 Photo updated! It's now visible to students.");
      }
    } catch (err) { console.error(err); }
  };

  const handleCreateMess = async (e) => {
    e.preventDefault();
    const payload = {
      messName: registrationForm.messName,
      pricePerMeal: Number(registrationForm.price),
      address: registrationForm.address,
      phone: registrationForm.phone,
      isVeg: registrationForm.isVeg === 'true',
      todaysMenu: [],
      weeklySchedule: { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: [] },
      name: user.name, email: user.email,
      imageUrl: "",
      location: { type: "Point", coordinates: [79.0882, 21.1458] },
      subscriptionPlans: {
        trial: { price: 50, duration: "1 Day" },
        weekly: { price: 350, duration: "7 Days" },
        monthly: { price: Number(registrationForm.price), duration: "30 Days" }
      }
    };

    try {
      const res = await fetch(`${API}/api/providers`, { // ✅ FIXED
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert("🎉 Mess Registered! Now manage your weekly schedule.");
        fetchMyMess(user.email);
      }
    } catch (err) { console.error(err); }
  };

  if (!user || loading) {
    return <div className="text-center mt-5"><div className="spinner-border text-warning"></div></div>;
  }

  if (user && !myMess) {
    return (
      <div style={{ backgroundColor: "#fffaf0", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "40px" }}>
        <div style={{ background: "white", padding: "40px", borderRadius: "24px", boxShadow: "0 10px 25px rgba(234, 88, 12, 0.1)", width: "100%", maxWidth: "600px" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: "700", textAlign: "center", marginBottom: "30px", color: "#ea580c" }}>Complete Your Mess Profile</h2>
          <form onSubmit={handleCreateMess}>
            <div className="mb-4">
              <label style={labelStyle}>Mess Name</label>
              <input type="text" placeholder="e.g. Annapurna Mess" style={formInputStyle} required value={registrationForm.messName} onChange={e => setRegistrationForm({...registrationForm, messName: e.target.value})} />
            </div>
            <div className="mb-4">
              <label style={labelStyle}>Price per Month (₹)</label>
              <input type="number" placeholder="e.g. 2500" style={formInputStyle} required value={registrationForm.price} onChange={e => setRegistrationForm({...registrationForm, price: e.target.value})} />
            </div>
            <div className="mb-4">
              <label style={labelStyle}>Address</label>
              <input type="text" placeholder="Mess location" style={formInputStyle} required value={registrationForm.address} onChange={e => setRegistrationForm({...registrationForm, address: e.target.value})} />
            </div>
            <div className="mb-4">
              <label style={labelStyle}>Contact Phone</label>
              <input type="text" placeholder="Mobile number" style={formInputStyle} required value={registrationForm.phone} onChange={e => setRegistrationForm({...registrationForm, phone: e.target.value})} />
            </div>
            <div className="mb-4">
              <label style={labelStyle}>Food Type</label>
              <select style={selectStyle} value={registrationForm.isVeg} onChange={e => setRegistrationForm({...registrationForm, isVeg: e.target.value})}>
                <option value="true">Pure Veg</option>
                <option value="false">Veg & Non-Veg</option>
              </select>
            </div>
            <button type="submit" style={{ ...addBtnStyle, width: "100%", padding: "15px" }}>Register My Mess</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#faf9f6", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <header style={{ backgroundColor: "white", padding: "15px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #fed7aa" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ background: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)", color: "white", width: "35px", height: "35px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px" }}>
            <i className="fas fa-utensils"></i>
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "700", color: "#431407" }}>{myMess?.messName}</h1>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "#9a3412" }}>Mess Owner Dashboard</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <button onClick={() => { localStorage.removeItem("user"); navigate('/login'); }} style={{ background: "none", border: "none", color: "#92400e", cursor: "pointer", fontWeight: "600", fontSize: "0.9rem" }}>Logout</button>
        </div>
      </header>

      <main style={{ padding: "40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", marginBottom: "40px" }}>
          <div style={statCardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
              <div style={{ color: "#ea580c" }}><i className="fas fa-users fs-5"></i></div>
              <span style={comingSoonBadge}>Live</span>
            </div>
            <h2 style={{ fontSize: "2rem", fontWeight: "700", margin: "0 0 5px 0" }}>—</h2>
            <p style={{ margin: 0, color: "#92400e", fontSize: "0.9rem" }}>Active Subscribers</p>
          </div>
          <div style={statCardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
              <div style={{ color: "#ea580c" }}><i className="fas fa-calendar-check fs-5"></i></div>
              <span style={totalBadge}>Total</span>
            </div>
            <h2 style={{ fontSize: "2rem", fontWeight: "700", margin: "0 0 5px 0" }}>{orders.filter(o => o.messName === myMess?.messName).length}</h2>
            <p style={{ margin: 0, color: "#92400e", fontSize: "0.9rem" }}>Student Orders</p>
          </div>
          <div style={statCardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
              <div style={{ color: "#ea580c" }}><i className="fas fa-utensils fs-5"></i></div>
              <span style={totalBadge}>Full Week</span>
            </div>
            <h2 style={{ fontSize: "2rem", fontWeight: "700", margin: "0 0 5px 0" }}>7/7</h2>
            <p style={{ margin: 0, color: "#92400e", fontSize: "0.9rem" }}>Menu Schedule</p>
          </div>
          <div style={statCardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
              <div style={{ color: "#ea580c" }}><i className="fas fa-star fs-5"></i></div>
              <span style={comingSoonBadge}>{myMess?.rating || 4.5}</span>
            </div>
            <h2 style={{ fontSize: "2rem", fontWeight: "700", margin: "0 0 5px 0" }}>{myMess?.reviews || 120}</h2>
            <p style={{ margin: 0, color: "#92400e", fontSize: "0.9rem" }}>Student Reviews</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
          <button style={activeTab === 'schedule' ? activeTabStyle : inactiveTabStyle} onClick={() => setActiveTab('schedule')}>Weekly Schedule</button>
          <button style={activeTab === 'orders' ? activeTabStyle : inactiveTabStyle} onClick={() => setActiveTab('orders')}>Student Orders</button>
          <button style={activeTab === 'subscription' ? activeTabStyle : inactiveTabStyle} onClick={() => setActiveTab('subscription')}>Subscription Plans</button>
          <button style={activeTab === 'profile' ? activeTabStyle : inactiveTabStyle} onClick={() => setActiveTab('profile')}>Mess Profile</button>
        </div>

        {activeTab === 'profile' && (
          <div style={{ background: "white", padding: "40px", borderRadius: "24px", boxShadow: "0 10px 25px rgba(234, 88, 12, 0.05)" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: "700", fontSize: "1.5rem", marginBottom: "30px", color: "#431407" }}>Manage Mess Profile</h3>
            
            <form onSubmit={handleUpdateProfile} style={{ maxWidth: "600px" }}>
              <div className="mb-4">
                <label style={labelStyle}>Mess Name</label>
                <input type="text" style={formInputStyle} value={profileForm.messName} onChange={e => setProfileForm({...profileForm, messName: e.target.value})} required />
              </div>
              <div className="mb-4">
                <label style={labelStyle}>Address</label>
                <input type="text" style={formInputStyle} value={profileForm.address} onChange={e => setProfileForm({...profileForm, address: e.target.value})} required />
              </div>
              <div className="mb-4">
                <label style={labelStyle}>Contact Phone</label>
                <input type="text" style={formInputStyle} value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} required />
              </div>
              
              <div className="mb-4">
                <label style={labelStyle}>Upload Mess Photo</label>
                <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                  <label 
                    htmlFor="file-upload" 
                    style={{ 
                      flex: 1, cursor: "pointer", border: "2px dashed #fed7aa", background: "#fffcf0", padding: "20px", 
                      borderRadius: "15px", textAlign: "center", color: "#ea580c", fontWeight: "700" 
                    }}
                  >
                    <i className="fas fa-cloud-upload-alt fs-4 mb-2 d-block"></i>
                    Select Real Photo From Computer
                  </label>
                  <input id="file-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileUpload} />
                </div>
              </div>

              <div className="mb-4">
                <label style={labelStyle}>Or Use Image URL</label>
                <input 
                  type="text" 
                  placeholder="Paste a link from Unsplash/Pexels" 
                  style={formInputStyle} 
                  value={profileForm.imageUrl} 
                  onChange={e => setProfileForm({...profileForm, imageUrl: e.target.value})} 
                />
              </div>
              
              <div style={{ marginBottom: "30px" }}>
                <p style={labelStyle}>Preview Current Photo:</p>
                <img 
                  src={profileForm.imageUrl || "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600"} 
                  alt="Preview" 
                  style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "15px", border: "1px solid #fed7aa" }} 
                />
              </div>

              <button type="submit" style={{ ...addBtnStyle, width: "100%" }}>Update Profile & Photo</button>
            </form>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div style={{ background: "white", padding: "40px", borderRadius: "24px", boxShadow: "0 10px 25px rgba(234, 88, 12, 0.05)" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: "700", fontSize: "1.5rem", marginBottom: "30px", color: "#431407" }}>Manage Weekly Menu</h3>
            
            <form onSubmit={handleUpdateSchedule} style={{ display: "flex", gap: "15px", marginBottom: "40px" }}>
              <select style={selectStyle} value={selectedScheduleDay} onChange={e => setSelectedScheduleDay(e.target.value)}>
                {days.map(d => <option key={d}>{d}</option>)}
              </select>
              <input type="text" placeholder="e.g. Special Chicken Biryani" style={formInputStyle} value={scheduleItem} onChange={e => setScheduleItem(e.target.value)} />
              <button type="submit" style={addBtnStyle}>Update Day</button>
            </form>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "25px" }}>
              {days.map(day => (
                <div key={day} style={{ border: "1px solid #fed7aa", padding: "20px", borderRadius: "20px", background: "#fffcf0" }}>
                  <h5 style={{ fontWeight: "800", color: "#ea580c", borderBottom: "1px solid #fed7aa", paddingBottom: "10px", marginBottom: "15px" }}>{day}</h5>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {myMess?.weeklySchedule?.[day] && myMess.weeklySchedule[day].length > 0 ? myMess.weeklySchedule[day].map((item, idx) => (
                      <span key={idx} style={{ background: "#ffedd5", color: "#9a3412", padding: "5px 12px", borderRadius: "10px", fontSize: "0.85rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                        {item} <i className="fas fa-times cursor-pointer" style={{ fontSize: "0.7rem", opacity: 0.6 }} onClick={() => deleteScheduleItem(day, idx)}></i>
                      </span>
                    )) : <p style={{ color: "#92400e", fontSize: "0.85rem", margin: 0 }}>No items set</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'subscription' && (
          <div style={{ background: "white", padding: "40px", borderRadius: "24px", boxShadow: "0 10px 25px rgba(234, 88, 12, 0.05)" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: "700", fontSize: "1.5rem", marginBottom: "30px", color: "#431407" }}>Set Subscription Prices</h3>
            
            <form onSubmit={handleUpdatePlans} style={{ maxWidth: "500px" }}>
              <div className="mb-4">
                <label style={labelStyle}>Trial Package (1 Day) Price (₹)</label>
                <input type="number" style={formInputStyle} value={plansForm.trial} onChange={e => setPlansForm({...plansForm, trial: e.target.value})} required />
              </div>
              <div className="mb-4">
                <label style={labelStyle}>Weekly Package (7 Days) Price (₹)</label>
                <input type="number" style={formInputStyle} value={plansForm.weekly} onChange={e => setPlansForm({...plansForm, weekly: e.target.value})} required />
              </div>
              <div className="mb-4">
                <label style={labelStyle}>Monthly Package (30 Days) Price (₹)</label>
                <input type="number" style={formInputStyle} value={plansForm.monthly} onChange={e => setPlansForm({...plansForm, monthly: e.target.value})} required />
              </div>
              <button type="submit" style={{ ...addBtnStyle, width: "100%" }}>Save Prices</button>
            </form>
          </div>
        )}

        {activeTab === 'orders' && (
          <div style={{ background: "white", padding: "40px", borderRadius: "24px", boxShadow: "0 10px 25px rgba(234, 88, 12, 0.05)" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: "700", fontSize: "1.5rem", marginBottom: "30px", color: "#431407" }}>Recent Student Orders</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #fed7aa" }}>
                    <th style={tableHeaderStyle}>Customer</th>
                    <th style={tableHeaderStyle}>Items</th>
                    <th style={tableHeaderStyle}>Status</th>
                    <th style={tableHeaderStyle}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.filter(o => o.messName === myMess?.messName).length > 0 ? orders.filter(o => o.messName === myMess?.messName).map(order => (
                    <tr key={order._id} style={{ borderBottom: "1px solid #fef3c7" }}>
                      <td style={tableCellStyle}>
                        <div style={{ fontWeight: '700', color: '#431407' }}>{order.customerName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#92400e' }}>{order.mobile}</div>
                      </td>
                      <td style={tableCellStyle}>{order.items}</td>
                      <td style={tableCellStyle}>
                        <span style={{ 
                          padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700',
                          backgroundColor: order.status === 'Accepted' ? '#dcfce7' : order.status === 'Cancelled' ? '#fee2e2' : '#fef3c7',
                          color: order.status === 'Accepted' ? '#166534' : order.status === 'Cancelled' ? '#991b1b' : '#92400e'
                        }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={tableCellStyle}>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button onClick={() => handleStatusUpdate(order._id, 'Accepted')} className="btn btn-success btn-sm"><i className="fas fa-check"></i></button>
                          <button onClick={() => handleStatusUpdate(order._id, 'Cancelled')} className="btn btn-danger btn-sm"><i className="fas fa-times"></i></button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="4" style={{ padding: "40px", textAlign: "center", color: "#92400e" }}>No orders received yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default MessOwnerDashboard;
