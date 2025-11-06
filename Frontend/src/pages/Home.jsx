import React from "react";
export default function Home() {
  return (
    <div className="hero-bg">
      <section className="hero-card">
        <h1>Gentle, Prevention-first Dentistry</h1>
        <p>Periodontology & Oral Implantology</p>
        <div className="cta-row">
          <a href="/appointment" className="cta-btn book">Book Appointment</a>
          <a href="/prices" className="cta-btn price">₹ View Prices</a>
          <a href="tel:+919511936441" className="cta-btn call">📞 +91 95119 36441</a>
          <a href="https://wa.me/919511936441" target="_blank" rel="noreferrer" className="cta-btn whatsapp">WhatsApp</a>
          <a href="tel:+919511936441" className="cta-btn emergency">Emergency</a>
        </div>
        <div className="clinic-features">
          <div className="feature-card">ISO-standard sterilization</div>
          <div className="feature-card">Digital X-rays & records</div>
          <div className="feature-card">Accessible: Lift & Parking</div>
        </div>
        <div className="clinic-subinfo">
          <div className="subinfo-card">
            <b>Operating Hours</b><br />Monday–Saturday: 10:00 AM – 8:00 PM<br />Sunday: By Appointment Only
          </div>
          <div className="subinfo-card">
            <b>Location</b><br />Shop No. 101A, Catholic Bank, Holi,<br />Maulana Azad Road, Holi Bazaar,<br />Gharat Wadi, Vasai West, Sandor,<br />Maharashtra 401201<br />Accessible with Lift & Parking
          </div>
          <div className="subinfo-card">
            <b>Contact Information</b><br />+91 95119 36441<br />Emergency Appointments Available
          </div>
        </div>
      </section>
      <section className="services-section">
        <h2>Our Services</h2>
        <div className="service-list">
          <span>🪥 Checkup</span>
          <span>🦷 Whitening</span>
          <span>🔩 Implants</span>
          <span>🦷 Braces</span>
          <span>🖥️ X-Ray</span>
        </div>
        <div style={{ margin: "26px auto", width: "100%", maxWidth: "400px" }}>
          <iframe
            title="Clinic Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d240929.44578613993!2d72.68065505024119!3d19.34651192574675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ad4c1f3d1893%3A0x8e0aaf15105eec5d!2sSamruddhi%20Dental%20Clinic%20and%20Implantology%20Centre!5e0!3m2!1sen!2sin!4v1761881469818!5m2!1sen!2sin"
            width="100%"
            height="220"
            style={{ borderRadius: "16px", border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>


        <div className="service-note">
          Evidence-based dental care for all ages.
        </div>
      </section>
      {/* <footer className="clinic-footer">
        &copy; {new Date().getFullYear()} MediBridge Dental Clinic
      </footer> */}
      <div className="sticky-emergency">
        <a href="tel:+919511936441">
          <span role="img" aria-label="ambulance">🚑</span> Emergency Consult
        </a>
      </div>
    </div>
  );
}
