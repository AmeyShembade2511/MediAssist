import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import useAuth from "./auth/useAuth";

import ChatPage from "./pages/ChatPage";
import AdminDashboard from "./pages/AdminDashboard";
import CompareDrugs from "./pages/CompareDrugs";
import SummarizeProtocol from "./pages/SummarizeProtocol";
import ExplainMode from "./pages/ExplainMode";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";

// ✅ Protected Route Component
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// ✅ Navbar with Logout button
function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null; // hide navbar if not logged in

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/">💬 Chat</Link>
        <Link to="/admin">📚 Admin</Link>
        <Link to="/compare">⚖️ Compare</Link>
        <Link to="/summarize">📄 Summarize</Link>
        <Link to="/explain">💡 Explain</Link>
      </div>
      <div className="nav-right">
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/compare"
            element={
              <ProtectedRoute>
                <CompareDrugs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/summarize"
            element={
              <ProtectedRoute>
                <SummarizeProtocol />
              </ProtectedRoute>
            }
          />
          <Route
            path="/explain"
            element={
              <ProtectedRoute>
                <ExplainMode />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
