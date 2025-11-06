  import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("Logging in...");
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.accessToken) {
        // Store token for auth
        localStorage.setItem("token", data.accessToken);
        setMsg("Login successful! Redirecting...");
        setTimeout(() => {
          navigate("/");
          window.location.reload(); // Ensures state updates for protected routes
        }, 700);
      } else {
        setMsg(data.message || "Login failed.");
      }
    } catch {
      setMsg("Error logging in!");
    }
  }

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-card-header">
          <img src="https://img.icons8.com/doodle/64/tooth--v1.png" alt="Logo" />
          <h2>Clinic Login</h2>
        </div>
        <form onSubmit={handleSubmit} autoComplete="off" className="auth-form">
          <label>Email</label>
          <input
            name="email"
            type="email"
            placeholder="Email address"
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
          <button type="submit" className="auth-btn" style={{ width: "100%" }}>
            Login
          </button>
        </form>
        {msg && (
          <div
            className={`auth-alert ${
              msg.includes("success") ? "auth-success" : "auth-error"
            }`}
          >
            {msg}
          </div>
        )}
        <div className="auth-footer">
          <span>
            New user? <a href="/register">Register here</a>
          </span>
        </div>
      </div>
    </div>
  );
}
