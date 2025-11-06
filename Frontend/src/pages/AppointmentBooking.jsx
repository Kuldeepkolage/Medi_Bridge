import React, { useState } from "react";
function AppointmentBooking() {
  const [form, setForm] = useState({ name:"",email:"",phone:"",date:"",service:""});
  const [msg, setMsg] = useState("");
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("Booking...");
    try {
      const res = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setMsg("Appointment booked!");
      else setMsg("Failed. Try again.");
      setForm({ name:"",email:"",phone:"",date:"",service:""});
    } catch {
      setMsg("Server error. Try later.");
    }
  }
  return (
    <div className="card">
      <h2>Book Appointment</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <input name="name" value={form.name} placeholder="Full Name" required onChange={handleChange}/>
        <input name="email" value={form.email} placeholder="Email" required onChange={handleChange}/>
        <input name="phone" value={form.phone} placeholder="Phone" required onChange={handleChange}/>
        <input name="date" type="date" value={form.date} required onChange={handleChange}/>
        <select name="service" value={form.service} required onChange={handleChange}>
          <option value="">Choose Service</option>
          <option>General Checkup</option>
          <option>Cleaning</option>
          <option>Implant</option>
          <option>Braces</option>
        </select>
        <button type="submit" className="btn">Book</button>
      </form>
      {msg && <div className="form-success">{msg}</div>}
    </div>
  );
}
export default AppointmentBooking;
