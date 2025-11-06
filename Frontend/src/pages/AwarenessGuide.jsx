import React from "react";
function AwarenessGuide() {
  return (
    <div className="card">
      <h2>
        <span role="img" aria-label="info">🦷</span> Dental Awareness Guidelines
      </h2>
      <ul style={{textAlign:"left"}}>
        <li>🕒 Brush twice daily with fluoride toothpaste.</li>
        <li>🍬 Cut down sugary food & drinks.</li>
        <li>🦷 Visit dentist every 6 months for checkup.</li>
        <li>🏉 Wear a mouthguard while playing sports.</li>
        <li>📋 Follow dentist’s advice after treatment.</li>
      </ul>
      <div style={{color:"#e53935",marginTop:20}}>
        <b>Patient Data Protected: </b>
        All records stored securely (as per backend logic).
      </div>
    </div>
  );
}
export default AwarenessGuide;
