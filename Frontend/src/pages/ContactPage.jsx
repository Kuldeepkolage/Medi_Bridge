import React, { useState } from "react";
function ContactPage() {
  const [form, setForm] = useState({ name:"",email:"",message:""});
  const [msg, setMsg] = useState("");
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("Sending...");
    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setMsg("Message sent!");
      else setMsg("Failed. Try again.");
      setForm({ name:"",email:"",message:""});
    } catch {
      setMsg("Server error. Try later.");
    }
  }
  return (
    <div className="card">
      <h2>Contact & Inquiry</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <input name="name" value={form.name} placeholder="Name" required onChange={handleChange}/>
        <input name="email" value={form.email} placeholder="Email" required onChange={handleChange}/>
        <textarea name="message" value={form.message} placeholder="Your inquiry" required onChange={handleChange}/>
        <button type="submit" className="btn">Send</button>
      </form>
      {msg && <div className="form-success">{msg}</div>}
      <p style={{marginTop:"2rem"}}>
        <b>Clinic Address:</b> Vasai,Maharashtra<br/>
        <b>Phone:</b> +91 95119 36441
      </p>
    </div>
  );
}
export default ContactPage;
