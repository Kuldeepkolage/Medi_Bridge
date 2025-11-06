// src/components/QualificationCard.jsx
import React from "react";
function QualificationCard() {
  return (
    <section>
      <h2>Our Dentists</h2>
      <div style={{display:"flex",gap:"2rem"}}>
        <div>
          <b>Dr. Smita Sharma</b><br/>
          BDS, MDS – Prosthodontics<br/>
          <small>15+ years specialization in Implants & Aesthetic Dentistry</small>
        </div>
        {/* Add more dentists as required */}
      </div>
    </section>
  );
}
export default QualificationCard;
