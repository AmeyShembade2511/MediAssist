import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../auth/useAuth";
import "./Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await auth.login({ email, password });
    if (res.ok) {
      navigate("/");
    } else {
      setError(res.error || "Invalid credentials");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome Back 👋</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>

        {error && <p className="error-message">{error}</p>}

        <p>
          Don’t have an account?{" "}
          <Link className="auth-link" to="/register">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
