import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function MessDetails() {
  const { id } = useParams();
  const [mess, setMess] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Day & Menu Logic
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDayIndex = new Date().getDay();
  const todayName = days[currentDayIndex];
  const [selectedDay, setSelectedDay] = useState(todayName);
  const navigate = useNavigate();

  // Images
  const vegImage = "https://images.unsplash.com/photo-1585237380908-1662df944439?w=800"; 
  const nonVegImage = "https://images.unsplash.com/photo-1606471191009-63994c53433b?w=800";

  // Data Loading
  useEffect(() => {
    fetch(`http://localhost:5000/api/providers/${id}`)
      .then(res => res.json())
      .then(data => {
        setMess(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const checkIfOpen = (openingTime, closingTime) => {
    if (!openingTime || !closingTime) return true;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    const [openH, openM] = openingTime.split(':').map(Number);
    const openMinutes = openH * 60 + openM;
    
    const [closeH, closeM] = closingTime.split(':').map(Number);
    let closeMinutes = closeH * 60 + closeM;
    if (closeMinutes < openMinutes) closeMinutes += 24 * 60; // handles after midnight like 23:00 to 02:00
    
    let adjustedCurrent = currentMinutes;
    if (currentMinutes < openMinutes && closeMinutes > 24*60) adjustedCurrent += 24 * 60;

    return adjustedCurrent >= openMinutes && adjustedCurrent <= closeMinutes;
  };

  // ✅ ORDER FUNCTION (Single Meal)
  const handleOrder = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) { alert("Please Login!"); navigate('/login'); return; }

    const items = mess.isVeg ? "Veg Thali Standard" : "Non-Veg Thali Standard"; // Simplified for now

    await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: user.name, mobile: user.email, messName: mess.messName, items: items, price: mess.pricePerMeal,
        providerId: mess._id, orderType: 'Single'
      })
    });
    alert(`✅ Order Placed for Today!`);
    navigate('/my-orders');
  };

  // ✅ NEW: SUBSCRIPTION FUNCTION
  const handleSubscribe = async (planType, price) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) { alert("Please Login!"); navigate('/login'); return; }

    const confirm = window.confirm(`Confirm ${planType} Subscription for ₹${price}?`);
    if(confirm) {
        
        // Calculate End Date
        const startDate = new Date();
        const endDate = new Date();
        if(planType === 'Weekly') endDate.setDate(startDate.getDate() + 7);
        if(planType === 'Monthly') endDate.setDate(startDate.getDate() + 30);

        await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: user.name, mobile: user.email, messName: mess.messName, 
            items: `${planType} Subscription Plan`, price: price,
            providerId: mess._id, orderType: planType,
            startDate: startDate, endDate: endDate, status: 'Accepted' // Auto-accept subscriptions for demo
          })
        });

        alert(`🎉 Congratulations! You are now a ${planType} subscriber. Meals will be delivered automatically.`);
        navigate('/my-orders');
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!mess) return <div className="text-center mt-5">Mess Not Found</div>;

  return (
    <div className="container my-5">
      <button onClick={() => navigate('/')} className="btn btn-outline-secondary mb-4">⬅ Back</button>
      
      <div className="row g-4">
        {/* LEFT: Image & Info */}
        <div className="col-lg-5">
            <div className="position-relative">
                <img src={mess.imageUrl || (mess.isVeg ? vegImage : nonVegImage)} className="w-100 rounded-4 shadow mb-3" style={{height: "300px", objectFit:"cover"}} alt="Food"/>
                {mess.rating && (
                    <span className="position-absolute bottom-0 end-0 bg-success text-white px-3 py-2 m-3 rounded-pill fw-bold shadow">
                        {mess.rating} ★ <small className="fw-normal">({mess.reviews}+)</small>
                    </span>
                )}
            </div>
            
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h2 className="fw-bold m-0 brand-font">{mess.messName}</h2>
                <div>
                    {checkIfOpen(mess.openingTime, mess.closingTime) ? 
                        <span className="badge bg-success rounded-pill px-3 py-2 shadow-sm" style={{animation: "pulse 2s infinite", fontSize: "14px"}}>🟢 Open</span> : 
                        <span className="badge bg-secondary rounded-pill px-3 py-2 shadow-sm" style={{fontSize: "14px"}}>🔴 Closed</span>
                    }
                </div>
            </div>

            <p className="text-muted fs-5"><i className="fas fa-map-marker-alt text-danger"></i> {mess.address}</p>
            
            {mess.openingTime && mess.closingTime && (
                <p className="text-secondary mb-2"><i className="far fa-clock text-primary"></i> <strong>Timings:</strong> {mess.openingTime} - {mess.closingTime}</p>
            )}

            <div className="d-flex gap-2 my-3">
                {mess.isVeg ? <span className="badge bg-success bg-opacity-10 text-success border border-success p-2">Pure Veg</span> : <span className="badge bg-danger bg-opacity-10 text-danger border border-danger p-2">Veg/Non-Veg</span>}
            </div>

            <h3 className="text-danger fw-bold my-4">₹{mess.pricePerMeal} <small className="fs-6 text-muted">/ meal</small></h3>
            
            <div className="card border-0 shadow-sm bg-light p-3 mb-4 rounded-3 text-start">
                <h6 className="fw-bold mb-3"><i className="fas fa-utensils text-info"></i> Today's Special Menu</h6>
                <ul className="mb-0">
                    {mess.todaysMenu && mess.todaysMenu.length > 0 ? (
                        mess.todaysMenu.map((item, idx) => (
                            <li key={idx} className="mb-1">{item}</li>
                        ))
                    ) : <li>Standard Thali</li>}
                </ul>
            </div>

            {/* Single Order Button */}
            <button onClick={handleOrder} className="btn btn-premium w-100 py-3 fw-bold shadow mb-4 mb-lg-0" disabled={!checkIfOpen(mess.openingTime, mess.closingTime)}>
                {checkIfOpen(mess.openingTime, mess.closingTime) ? "Order Just For Today 🍛" : "Currently Closed"}
            </button>
        </div>

        {/* RIGHT: SUBSCRIPTION PLANS (The New Feature) */}
        <div className="col-lg-7">
            <h3 className="fw-bold mb-4 brand-font"><span className="gradient-text">💎 Save Money with Subscriptions</span></h3>
            
            <div className="row g-3">
                
                {/* 📅 WEEKLY PLAN */}
                <div className="col-md-6 mt-lg-0 mt-3">
                    <div className="card h-100 border-primary border-2 shadow-sm hover-effect rounded-4 overflow-hidden">
                        <div className="card-header bg-primary text-white text-center fw-bold border-0 py-3 brand-font">
                            7 DAYS TRIAL
                        </div>
                        <div className="card-body text-center d-flex flex-column">
                            <h3 className="fw-bold">₹{mess.pricePerMeal * 7 - 50}</h3>
                            <p className="text-muted text-decoration-line-through small">₹{mess.pricePerMeal * 7}</p>
                            <ul className="list-unstyled text-start mb-4 small">
                                <li>✅ Lunch & Dinner included</li>
                                <li>✅ Valid for 1 Week</li>
                                <li>❌ No Skip Option</li>
                            </ul>
                            <button onClick={() => handleSubscribe('Weekly', mess.pricePerMeal * 7 - 50)} className="btn btn-outline-primary fw-bold mt-auto rounded-pill px-4 py-2 hover-effect">Get Weekly Pass</button>
                        </div>
                    </div>
                </div>

                {/* 📅 MONTHLY PLAN (Best Value) */}
                <div className="col-md-6 mt-lg-0 mt-3">
                    <div className="card h-100 border-warning border-2 shadow-lg hover-effect rounded-4 overflow-hidden position-relative">
                        <div className="position-absolute top-0 end-0 bg-warning text-dark px-3 py-1 small fw-bold rounded-start-pill rounded-bottom-0 z-1" style={{transform:"translate(0, -1px)"}}>BEST VALUE</div>
                        <div className="card-header bg-warning text-dark text-center fw-bold border-0 py-3 brand-font">
                            30 DAYS PRO
                        </div>
                        <div className="card-body text-center d-flex flex-column bg-warning bg-opacity-10">
                            <h3 className="fw-bold">₹{mess.pricePerMeal * 30 - 300}</h3>
                            <p className="text-muted text-decoration-line-through small">₹{mess.pricePerMeal * 30}</p>
                            <ul className="list-unstyled text-start mb-4 small">
                                <li>✅ Lunch & Dinner included</li>
                                <li>✅ <strong>Sunday Special Included</strong></li>
                                <li>✅ <strong>5 Skip Meals Available</strong></li>
                            </ul>
                            <button onClick={() => handleSubscribe('Monthly', mess.pricePerMeal * 30 - 300)} className="btn btn-warning text-dark fw-bold mt-auto rounded-pill px-4 py-2 hover-effect shadow-sm">Get Monthly Pass</button>
                        </div>
                    </div>
                </div>

            </div>

            {/* Note Section */}
            <div className="alert alert-warning mt-4 d-flex align-items-center rounded-4 shadow-sm border-0 bg-warning bg-opacity-25">
                <i className="fas fa-info-circle me-2 fs-4"></i>
                <div>
                    <strong>Why Subscribe?</strong> Subscribers get priority delivery and save up to ₹300 per month!
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}

export default MessDetails;