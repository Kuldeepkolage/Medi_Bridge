// src/components/EmergencyButton.jsx
import React from "react";
function EmergencyButton() {
  return (
    <a href="tel:+911234567890">
      <button style={{margin: "1rem", background: "#e53935", color: "#fff", padding: "0.8em 1.2em", borderRadius: "8px", border: "none"}}>
        Emergency Consultation
      </button>
    </a>
  );
}
export default EmergencyButton;
