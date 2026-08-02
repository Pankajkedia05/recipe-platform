import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="section-card" style={{ maxWidth: "520px", margin: "0 auto" }}>
        <div className="page-heading">
          <div>
            <h1>Welcome back</h1>
            <p className="text-muted">Log in to save favorites and add your best recipes.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-field">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Password"
              required
            />
          </div>

          <button type="submit" className="btn-primary">Login</button>
        </form>

        <p className="text-muted" style={{ marginTop: "18px" }}>
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
