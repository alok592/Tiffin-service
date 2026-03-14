import React, { useEffect, useState } from 'react';

function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // API se Orders lao
    fetch('http://localhost:5000/api/orders')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error("Error:", err));
  }, []);

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2 style={{ borderBottom: "2px solid #e74c3c", paddingBottom: "10px" }}>📦 My Orders & Subscriptions</h2>

      {orders.length === 0 ? <p>No active orders or subscriptions found.</p> : (
        <div className="row g-4 mt-4">
          {orders.map((order) => {
             const isSubscription = order.orderType === 'Weekly' || order.orderType === 'Monthly';
             
             return (
                <div key={order._id} className="col-12">
                  <div className={`p-4 rounded-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center position-relative hover-effect`}
                       style={{ 
                         background: isSubscription ? "#fdfbf7" : "#fff", 
                         boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                         border: "1px solid #f1f5f9"
                       }}>
                    
                    {isSubscription && <div className="position-absolute top-0 start-0 h-100" style={{width: "6px", background: "#f59e0b", borderTopLeftRadius: "15px", borderBottomLeftRadius: "15px"}}></div>}
                    
                    <div className="mb-3 mb-md-0 ms-md-2">
                        <h3 className="m-0 text-dark d-flex align-items-center flex-wrap gap-2 brand-font">
                            {order.messName} 
                            {isSubscription && <span className="badge bg-warning text-dark px-3 py-1 rounded-pill" style={{fontSize: "0.8rem"}}>★ Subscription</span>}
                        </h3>
                        <p className="my-2 text-muted fw-bold">{order.items}</p>
                        
                        {isSubscription ? (
                            <small className="text-secondary">
                              <i className="far fa-calendar-alt text-warning me-1"></i> Added: {new Date(order.startDate).toLocaleDateString()} <br/>
                              <i className="fas fa-hourglass-half text-danger me-1 mt-1"></i> Expires: <strong>{new Date(order.endDate).toLocaleDateString()}</strong>
                            </small>
                        ) : (
                            <small className="text-secondary"><i className="far fa-calendar-alt text-primary me-1"></i> Ordered on: {new Date(order.date).toLocaleDateString()}</small>
                        )}
                    </div>
                    <div className="text-md-end text-start mt-2 mt-md-0">
                        <h3 className="m-0 text-dark brand-font fw-bold">₹{order.price}</h3>
                        <span className={`badge rounded-pill px-3 py-2 mt-2 shadow-sm ${order.status === "Accepted" ? "bg-success" : "bg-warning text-dark"}`}>
                          {order.status}
                        </span>
                    </div>
                  </div>
                </div>
            )
          })}
        </div>
      )}
    </div>
  );
}

export default MyOrders;