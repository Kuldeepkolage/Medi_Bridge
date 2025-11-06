// src/components/CTAButton.jsx
import React from "react";
function CTAButton() {
  return (
    <a href="/appointment">
      <button style={{margin: "1rem", background: "#0099f7", color: "#fff", padding: "0.8em 1.2em", borderRadius: "8px", border: "none"}}>
        Book an Appointment
      </button>
    </a>
  );
}
export default CTAButton;
