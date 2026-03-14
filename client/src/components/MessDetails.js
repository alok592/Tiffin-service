import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function MessDetails() {
  const { id } = useParams();
  const [mess, setMess] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const currentDayIndex = new Date().getDay();
  // Adjust index because JS getDay() starts with Sunday at 0
  const todayName = days[currentDayIndex === 0 ? 6 : currentDayIndex - 1];
  
  const [selectedDay, setSelectedDay] = useState(todayName);
  const navigate = useNavigate();

  // Fallback Weekly Menu Data (If owner hasn't set one)
  const weeklyVegMenu = {
    Monday: ["Aloo Matar Rassa", "Yellow Dal Fry", "Jeera Rice", "4 Chapati", "Salad"],
    Tuesday: ["Besan (Zunka)", "Thecha", "Dal Tadka", "Rice", "2 Bhakri + 2 Chapati"],
    Wednesday: ["Chana Masala", "Dal Fry", "Plain Rice", "4 Chapati", "Papad"],
    Thursday: ["Bhindi Masala", "Varan Bhaat (Dal Rice)", "4 Chapati", "Pickle"],
    Friday: ["Baingan Bharta", "Moong Dal", "Rice", "4 Chapati", "Salad"],
    Saturday: ["Mix Veg Korma", "Dal Tadka", "Jeera Rice", "4 Chapati", "Fried Chilli"],
    Sunday: ["Paneer Butter Masala", "Dal Makhani", "Jeera Rice", "2 Butter Naan", "Gulab Jamun", "Solkadhi"]
  };

  const weeklyNonVegMenu = {
    Monday: ["Egg Curry", "Dal Fry", "Rice", "4 Chapati", "Salad"],
    Tuesday: ["Chicken Masala", "Rassa", "Rice", "2 Bhakri", "2 Chapati"],
    Wednesday: ["Anda Bhurji", "Dal Tadka", "Plain Rice", "4 Chapati", "Papad"],
    Thursday: ["Chicken Curry", "Jeera Rice", "4 Chapati", "Onion Salad"],
    Friday: ["Egg Masala", "Dal Fry", "Rice", "4 Chapati", "Pickle"],
    Saturday: ["Chicken Liver Fry", "Dal", "Rice", "4 Chapati", "Thecha"],
    Sunday: ["Chicken Biryani", "Mirchi Salan", "Boiled Egg", "Raita", "Kheer", "Cold Drink"]
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/providers')
      .then(res => res.json())
      .then(data => {
        const found = data.find(p => p._id === id);
        setMess(found);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleOrder = async (planType = "Daily") => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        alert("Please Login first!");
        navigate('/login');
        return;
    }

    let orderPrice = mess.pricePerMeal;
    let orderItems = displayMenu.join(", ");
    let duration = "1 Day";

    if (planType === "Trial") {
      orderPrice = mess.subscriptionPlans?.trial?.price || 100;
      duration = "1 Day";
    } else if (planType === "Weekly") {
      orderPrice = mess.subscriptionPlans?.weekly?.price || 700;
      duration = "7 Days";
    } else if (planType === "Monthly") {
      orderPrice = mess.subscriptionPlans?.monthly?.price || 2500;
      duration = "30 Days";
    }

    const payload = {
        customerName: user.name,
        mobile: user.email,
        messName: mess.messName,
        messId: mess._id,
        items: planType === "Daily" ? orderItems : `${planType} Subscription Plan`,
        price: orderPrice,
        status: "Pending",
        date: new Date(),
        planType: planType,
        duration: duration
    };

    try {
        const res = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert(`✅ ${planType} Subscription Booked! Wait for mess owner to accept.`);
            navigate('/student-dashboard');
        }
    } catch (error) { console.error(error); }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-warning"></div></div>;
  if (!mess) return <div className="text-center mt-5"><h3>❌ Mess Not Found</h3></div>;

  // Use Owner's Weekly Schedule if it exists for the selected day, otherwise use fallback
  const ownerDayMenu = mess?.weeklySchedule?.[selectedDay];
  const displayMenu = (ownerDayMenu && ownerDayMenu.length > 0) 
    ? ownerDayMenu 
    : (mess?.isVeg ? weeklyVegMenu[selectedDay] : (weeklyNonVegMenu[selectedDay] || weeklyVegMenu[selectedDay]));

  const currentImage = mess?.imageUrl || "";

  return (
    <div style={{ backgroundColor: "#faf9f6", minHeight: "100vh", padding: "40px 0" }}>
      <div className="container">
        <button onClick={() => navigate(-1)} style={backBtnStyle} className="mb-4">
          <i className="fas fa-arrow-left me-2"></i> Back
        </button>
        
        <div className="row g-5 align-items-start">
          <div className="col-lg-5">
            <div style={messProfileCardStyle}>
              <div style={{ position: 'relative' }}>
                {currentImage ? (
                  <img src={currentImage} alt={mess.messName} style={messImgStyle} 
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }} />
                ) : (
                  <div style={{ width: "100%", height: "350px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "#94a3b8" }}>
                    <i className="fas fa-image fs-1 mb-2"></i>
                    <p>No Photo Added By Owner</p>
                  </div>
                )}
                <div style={messOverlayStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '700' }}>{mess.messName}</h2>
                    <i className="fas fa-check-circle" style={{ color: "#3b82f6", fontSize: "1.2rem" }} title="Verified Mess"></i>
                  </div>
                </div>
              </div>
              <div style={{ padding: '25px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ margin: 0, color: '#ea580c', fontWeight: '800', fontSize: '2.2rem' }}>₹{mess.subscriptionPlans?.monthly?.price || mess.pricePerMeal}</h2>
                  <span style={{ ...badgeStyle, background: mess.isVeg ? '#10b981' : '#ef4444' }}>
                    {mess.isVeg ? 'Pure Veg' : 'Veg & Non-Veg'}
                  </span>
                </div>
                <p style={{ color: '#9a3412', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fas fa-location-dot" style={{ color: '#ea580c' }}></i> {mess.address}
                </p>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div style={menuCardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
                <span style={{ fontSize: '1.5rem' }}>📅</span>
                <h3 style={{ margin: 0, fontWeight: '700', fontFamily: "'Playfair Display', serif", color: "#431407" }}>Check Weekly Menu</h3>
              </div>
              
              <div style={tabsContainerStyle}>
                {days.map(day => (
                  <button 
                    key={day} 
                    onClick={() => setSelectedDay(day)}
                    style={selectedDay === day ? activeTabStyle : tabStyle}
                  >
                    {day} {day === todayName && "(Today)"}
                  </button>
                ))}
              </div>

              <div style={menuContentBoxStyle}>
                <h5 style={{ color: '#ea580c', fontWeight: '700', marginBottom: '20px', fontSize: '1.1rem' }}>
                  {selectedDay}'s Menu
                </h5>
                <div style={menuItemsGridStyle}>
                  {displayMenu.map((item, idx) => (
                    <div key={idx} style={menuItemStyle}>
                      <span style={dotStyle}></span> {item}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: '30px', color: '#92400e', fontSize: '0.9rem' }}>
                You are ordering for <strong>Today ({todayName})</strong>
              </div>
              
              <button style={bookBtnStyle} className="hover-effect" onClick={() => handleOrder("Daily")}>
                Book Today's Tiffin 🚀
              </button>
            </div>

            {/* Subscription Packages Section */}
            <div style={{ ...menuCardStyle, marginTop: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
                <span style={{ fontSize: '1.5rem' }}>🎁</span>
                <h3 style={{ margin: 0, fontWeight: '700', fontFamily: "'Playfair Display', serif", color: "#431407" }}>Choose Your Plan</h3>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                <div style={packageCardStyle}>
                  <h5 style={packageTitleStyle}>Trial Pack</h5>
                  <p style={packageDurationStyle}>1 Day</p>
                  <h4 style={packagePriceStyle}>₹{mess.subscriptionPlans?.trial?.price || 100}</h4>
                  <button style={packageBtnStyle} onClick={() => handleOrder("Trial")}>Buy Now</button>
                </div>
                
                <div style={{ ...packageCardStyle, border: '2px solid #ea580c', background: '#fff7ed' }}>
                  <div style={popularBadgeStyle}>Popular</div>
                  <h5 style={packageTitleStyle}>Weekly</h5>
                  <p style={packageDurationStyle}>7 Days</p>
                  <h4 style={packagePriceStyle}>₹{mess.subscriptionPlans?.weekly?.price || 700}</h4>
                  <button style={{ ...packageBtnStyle, background: '#ea580c' }} onClick={() => handleOrder("Weekly")}>Buy Now</button>
                </div>
                
                <div style={packageCardStyle}>
                  <h5 style={packageTitleStyle}>Monthly</h5>
                  <p style={packageDurationStyle}>30 Days</p>
                  <h4 style={packagePriceStyle}>₹{mess.subscriptionPlans?.monthly?.price || 2500}</h4>
                  <button style={packageBtnStyle} onClick={() => handleOrder("Monthly")}>Buy Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- NEW STYLES ---
const packageCardStyle = { border: '1px solid #fed7aa', padding: '20px', borderRadius: '18px', textAlign: 'center', position: 'relative' };
const packageTitleStyle = { fontSize: '1rem', fontWeight: '700', color: '#431407', marginBottom: '5px' };
const packageDurationStyle = { fontSize: '0.8rem', color: '#92400e', marginBottom: '15px' };
const packagePriceStyle = { fontSize: '1.5rem', fontWeight: '800', color: '#ea580c', marginBottom: '20px' };
const packageBtnStyle = { width: '100%', padding: '8px', border: 'none', background: '#92400e', color: 'white', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer' };
const popularBadgeStyle = { position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#ea580c', color: 'white', padding: '2px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' };

// --- STYLES ---
const backBtnStyle = { background: 'white', border: '1px solid #fed7aa', padding: '8px 20px', borderRadius: '10px', fontWeight: '600', color: '#92400e', cursor: 'pointer' };
const messProfileCardStyle = { background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(234, 88, 12, 0.05)' };
const messImgStyle = { width: '100%', height: '350px', objectFit: 'cover' };
const messOverlayStyle = { position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '30px 25px', color: 'white' };
const badgeStyle = { color: 'white', padding: '5px 15px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' };
const menuCardStyle = { background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 10px 30px rgba(234, 88, 12, 0.05)' };
const tabsContainerStyle = { display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '25px', borderBottom: '1px solid #fed7aa' };
const tabStyle = { background: 'white', border: '1px solid #fed7aa', padding: '10px 20px', borderRadius: '20px', whiteSpace: 'nowrap', color: '#92400e', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer' };
const activeTabStyle = { background: '#ea580c', border: '1px solid #ea580c', padding: '10px 20px', borderRadius: '20px', whiteSpace: 'nowrap', color: 'white', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)' };
const menuContentBoxStyle = { background: '#fffcf0', borderRadius: '15px', padding: '30px', border: '1px solid #fed7aa' };
const menuItemsGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' };
const menuItemStyle = { display: 'flex', alignItems: 'center', gap: '10px', color: '#431407', fontWeight: '600', fontSize: '1rem' };
const dotStyle = { width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' };
const bookBtnStyle = { width: '100%', marginTop: '20px', background: '#059669', color: 'white', border: 'none', padding: '18px', borderRadius: '15px', fontWeight: '700', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)' };

export default MessDetails;
