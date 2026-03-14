import React from 'react';
import { useNavigate } from 'react-router-dom';

function About() {
  const navigate = useNavigate();

  return (
    <div className="container my-5">
      <div className="row align-items-center">
        <div className="col-md-6">
          <h1 className="fw-bold text-danger">About Tiffin Taste 🍛</h1>
          <p className="lead text-muted">
            Students aur Mess Owners ko milane wala sabse aasaan tareeka.
          </p>
          <p>
            Humara mission hai ki har student ko **Ghar jaisa khana** mile aur har Mess Owner ka **Business badhe**. 
            Hum food wastage kam karne ke liye "Kitchen Analytics" ka use karte hain.
          </p>
          <button onClick={() => navigate('/')} className="btn btn-danger btn-lg mt-3">
            Order Now
          </button>
        </div>
        <div className="col-md-6 text-center">
          <img 
            src="https://img.freepik.com/free-vector/delivery-service-illustrated_23-2148505081.jpg" 
            alt="About Us" 
            className="img-fluid rounded shadow"
            style={{ maxHeight: '400px' }}
          />
        </div>
      </div>
    </div>
  );
}

export default About;