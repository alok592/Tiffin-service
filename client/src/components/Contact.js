import React from 'react';

function Contact() {
  return (
    <div className="container my-5" style={{maxWidth: "600px"}}>
      <h2 className="text-center fw-bold mb-4">Contact Us 📞</h2>
      <div className="card p-4 shadow-sm">
        <div className="mb-3">
            <label className="form-label">Your Name</label>
            <input type="text" className="form-control" placeholder="Enter name" />
        </div>
        <div className="mb-3">
            <label className="form-label">Message</label>
            <textarea className="form-control" rows="4" placeholder="How can we help?"></textarea>
        </div>
        <button className="btn btn-danger w-100">Send Message</button>
      </div>
    </div>
  );
}
export default Contact;