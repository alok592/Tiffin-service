import React from 'react';

function About() {
  return (
    <div className="container my-5 text-center">
      <h1 className="fw-bold text-danger">About Tiffin Taste 🍱</h1>
      <p className="lead text-muted mt-3">
        We connect students with the best home-made tiffin services in Nagpur. 
        Clean, Hygienic, and Affordable food just a click away.
      </p>
      <img src="https://source.unsplash.com/random/800x400/?food,kitchen" className="img-fluid rounded shadow mt-4" alt="About us" />
    </div>
  );
}
export default About;