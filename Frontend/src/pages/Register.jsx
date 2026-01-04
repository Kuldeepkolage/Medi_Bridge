import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: ""
  });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("Registering...");
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("Registered! Please login.");
        setTimeout(() => navigate("/login"), 1200);
      } else setMsg(data.message || "Register failed.");
    } catch {
      setMsg("Error registering!");
    }
  }

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-card-header">
          <img src="https://img.icons8.com/doodle/64/tooth--v1.png" alt="Logo" />
          <h2>Register at MediBridge</h2>
        </div>
        <form onSubmit={handleSubmit} autoComplete="off" className="auth-form">
          <label>Full Name</label>
          <input
            name="fullName"
            type="text"
            placeholder="Your full name"
            value={form.fullName}
            required
            onChange={handleChange}
          />
          <label>Username</label>
          <input
            name="username"
            type="text"
            placeholder="Create a username"
            value={form.username}
            required
            onChange={handleChange}
          />
          <label>Email Address</label>
          <input
            name="email"
            type="email"
            placeholder="Your email"
            value={form.email}
            required
            onChange={handleChange}
          />
          <label>Password</label>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            required
            onChange={handleChange}
          />
          <button type="submit" className="auth-btn">
            Register
          </button>
        </form>
        {msg && (
          <div
            className={`auth-alert ${
              msg.includes("Registered") ? "auth-success" : "auth-error"
            }`}
          >
            {msg}
          </div>
        )}
        <div className="auth-footer">
          <span>
            Already have an account? <a href="/login">Login</a>
          </span>
        </div>
      </div>
    </div>
  );
}
