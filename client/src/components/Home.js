import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import API from "../api";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function Home() {

  const [providers, setProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {

    const fetchAllProviders = (lat = null, lng = null) => {

      let url = `${API}/api/providers`;

      if (lat && lng) {
        url += `?lat=${lat}&lng=${lng}`;
      }

      fetch(url)
        .then(res => res.json())
        .then(data => setProviders(Array.isArray(data) ? data : []))
        .catch(err => console.error(err));

    };

    if ("geolocation" in navigator) {

      navigator.geolocation.getCurrentPosition(

        (position) => {

          const { latitude, longitude } = position.coords;
          fetchAllProviders(latitude, longitude);

        },

        () => fetchAllProviders()

      );

    } else {

      fetchAllProviders();

    }

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

  }, []);

  const handleLogout = () => {

    localStorage.removeItem("user");
    window.location.reload();

  };

  const filteredProviders = providers.filter(p =>
    p.messName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (

    <div style={{backgroundColor:"#faf9f6",minHeight:"100vh"}}>

      {/* NAVBAR */}

      <nav className="navbar navbar-expand-lg px-4 py-3">

        <Link className="navbar-brand fw-bold brand-font" to="/">
          MealConnect
        </Link>

        <div className="ms-auto d-flex gap-3">

          {user ? (

            <>
              {user.role === "owner" ? (

                <Link to="/mess-dashboard" className="btn btn-outline-dark btn-sm">
                  Dashboard
                </Link>

              ) : (

                <Link to="/student-dashboard" className="btn btn-outline-dark btn-sm">
                  {user.name}
                </Link>

              )}

              <button onClick={handleLogout} className="btn btn-light btn-sm">
                Logout
              </button>
            </>

          ) : (

            <>
              <Link to="/login" className="btn btn-outline-dark btn-sm">
                Login
              </Link>

              <Link to="/register" className="btn btn-warning btn-sm text-white">
                Sign Up
              </Link>
            </>

          )}

        </div>

      </nav>

      {/* HERO */}

      <div className="container py-5 text-center">

        <h1 className="fw-bold brand-font mb-3">
          Affordable Home-Style Meals
        </h1>

        <p className="text-muted">
          Find the best mess near your college
        </p>

      </div>

      {/* PROVIDERS */}

      <div className="container pb-5">

        <div className="row g-4">

          {filteredProviders.length > 0 ? (

            filteredProviders.map((mess) => (

              <div className="col-md-4" key={mess._id}>

                <div className="card shadow-sm border-0 h-100">

                  {mess.imageUrl ? (

                    <img
                      src={mess.imageUrl}
                      className="card-img-top"
                      alt={mess.messName}
                      style={{height:"220px",objectFit:"cover"}}
                    />

                  ) : (

                    <div style={{
                      height:"220px",
                      background:"#f1f5f9",
                      display:"flex",
                      alignItems:"center",
                      justifyContent:"center"
                    }}>
                      No Image
                    </div>

                  )}

                  <div className="card-body">

                    <h5 className="fw-bold">{mess.messName}</h5>

                    <p className="text-muted small">
                      {mess.address}
                    </p>

                    <div className="d-flex justify-content-between align-items-center">

                      <strong>
                        ₹{mess.subscriptionPlans?.monthly?.price || mess.pricePerMeal}/month
                      </strong>

                      <Link
                        to={`/mess/${mess._id}`}
                        className="btn btn-outline-dark btn-sm"
                      >
                        View
                      </Link>

                    </div>

                  </div>

                </div>

              </div>

            ))

          ) : (

            <div className="text-center py-5">

              <h5 className="text-muted">
                No messes registered yet
              </h5>

            </div>

          )}

        </div>

      </div>

    </div>

  );

}

export default Home;
