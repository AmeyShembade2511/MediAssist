import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../auth/useAuth";
import "./Auth.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const data = await auth.register({ email, password, full_name: fullName });
    if (data.user) {
      setMessage("✅ Registered successfully! You can now login.");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setMessage("❌ " + (data.error || "Registration failed."));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account ✨</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>

        {message && (
          <p
            className={
              message.startsWith("✅") ? "success-message" : "error-message"
            }
          >
            {message}
          </p>
        )}

        <p>
          Already have an account?{" "}
          <Link className="auth-link" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
