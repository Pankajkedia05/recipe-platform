import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate("/");
    } catch (error) {
      alert("Registration failed");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="section-card" style={{ maxWidth: "520px", margin: "0 auto" }}>
        <div className="page-heading">
          <div>
            <h1>Create account</h1>
            <p className="text-muted">Sign up and start sharing your favorite recipes.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-field">
            <label>Username</label>
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Username"
              required
            />
          </div>

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

          <button type="submit" className="btn-primary">Register</button>
        </form>

        <p className="text-muted" style={{ marginTop: "18px" }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
