import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API = "https://tiffin-service-arb4.onrender.com";

function StudentDashboard() {

  const [user, setUser] = useState(null);
  const [nearbyMesses, setNearbyMesses] = useState([]);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [orders, setOrders] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser || storedUser.role !== 'student') {
      navigate('/login');
      return;
    }

    setUser(storedUser);

    /* --------------------------
       Fetch Mess Providers
    -------------------------- */

    fetch(`${API}/api/providers`)
      .then(res => res.json())
      .then(data => setNearbyMesses(data))
      .catch(err => console.error(err));


    /* --------------------------
       Fetch Orders
    -------------------------- */

    fetch(`${API}/api/orders`)
      .then(res => res.json())
      .then(data => {

        const studentOrders = data.filter(
          o => o.mobile === storedUser.email
        );

        setOrders(studentOrders);

        const latestActive = studentOrders.find(
          o => o.status === 'Accepted'
        );

        if (latestActive) {

          setActiveSubscription({
            messName: latestActive.messName,
            plan: latestActive.planType || "Monthly Plan",
            status: "Active",
            mealsRemaining:
              latestActive.planType === 'Trial'
                ? 1
                : latestActive.planType === 'Weekly'
                ? 7
                : 28
          });

        }

      })
      .catch(err => console.error(err));

  }, [navigate]);



  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate('/login');
  };



  return (

    <div style={{ backgroundColor: "#faf9f6", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}

      <header style={{ backgroundColor: "white", padding: "15px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee", position: "sticky", top: 0 }}>

        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>

          <div style={{ background: "#f59e0b", color: "white", width: "35px", height: "35px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px" }}>
            <i className="fas fa-utensils"></i>
          </div>

          <h1 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "700", color: "#1e1e1e" }}>
            MealConnect
          </h1>

        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>

          <span style={{ fontSize: "0.9rem", fontWeight: "600" }}>
            Welcome, {user?.name} 👋
          </span>

          <button onClick={handleLogout}
            style={{
              background: "#f3f4f6",
              border: "none",
              padding: "8px 15px",
              borderRadius: "8px",
              cursor: "pointer"
            }}>
            Logout
          </button>

        </div>

      </header>



      <main style={{ padding: "40px" }}>

        {/* Nearby Messes */}

        <div style={cardStyle}>

          <h3 style={sectionTitleStyle}>Explore Messes</h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "25px" }}>

            {nearbyMesses.length > 0 ? nearbyMesses.map(mess => (

              <div key={mess._id} style={zomatoCardStyle}>

                {mess.imageUrl ?

                  <img
                    src={mess.imageUrl}
                    alt={mess.messName}
                    style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "20px" }}
                  />

                  :

                  <div style={{ width: "100%", height: "200px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "20px" }}>
                    No Photo
                  </div>

                }

                <div style={{ padding: "10px" }}>

                  <h5>{mess.messName}</h5>

                  <p style={{ color: "#6b7280" }}>
                    ₹{mess.subscriptionPlans?.monthly?.price || mess.pricePerMeal}/month
                  </p>

                  <Link to={`/mess/${mess._id}`} style={{ color: "#f59e0b" }}>
                    View Menu →
                  </Link>

                </div>

              </div>

            )) :

              <p>No messes available.</p>

            }

          </div>

        </div>



        {/* Orders */}

        <div style={{ ...cardStyle, marginTop: "30px" }}>

          <h3 style={sectionTitleStyle}>Recent Orders</h3>

          <table style={{ width: "100%" }}>

            <thead>

              <tr>
                <th>Date</th>
                <th>Mess</th>
                <th>Meal</th>
                <th>Status</th>
              </tr>

            </thead>

            <tbody>

              {orders.map(order => (

                <tr key={order._id}>

                  <td>{new Date(order.date).toLocaleDateString()}</td>
                  <td>{order.messName}</td>
                  <td>{order.items}</td>
                  <td>{order.status}</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </main>

    </div>

  );
}



/* ---------------- Styles ---------------- */

const cardStyle = {
  background: "white",
  padding: "30px",
  borderRadius: "24px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.02)"
};

const sectionTitleStyle = {
  fontWeight: "700",
  fontSize: "1.25rem",
  marginBottom: "20px"
};

const zomatoCardStyle = {
  cursor: "pointer",
  border: "1px solid #f3f4f6",
  borderRadius: "20px",
  overflow: "hidden"
};

export default StudentDashboard;
