import React from 'react';

function Contact() {
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-5">
              <h2 className="text-center fw-bold mb-4">Contact Us 📞</h2>
              <p className="text-center text-muted mb-4">Koi dikkat hai? Humein message karein.</p>
              
              <form>
                <div className="mb-3">
                  <label className="form-label">Your Name</label>
                  <input type="text" className="form-control" placeholder="Enter name" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" placeholder="Enter email" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Message</label>
                  <textarea className="form-control" rows="4" placeholder="How can we help?"></textarea>
                </div>
                <button className="btn btn-dark w-100 py-2 fw-bold">Send Message</button>
              </form>
            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;