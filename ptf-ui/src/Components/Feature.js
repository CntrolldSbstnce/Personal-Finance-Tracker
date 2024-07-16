import React from 'react';

function Feature({ title, description, link }) {
  return (
    <div className="feature">
      <h3>{title}</h3>
      <p>{description}</p>
      <button onClick={() => window.location.href = link}>Learn More</button>
    </div>
  );
}

export default Feature;
