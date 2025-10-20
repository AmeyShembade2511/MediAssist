import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import AdminDashboard from "./pages/AdminDashboard";
import CompareDrugs from "./pages/CompareDrugs";
import SummarizeProtocol from "./pages/SummarizeProtocol";
import ExplainMode from "./pages/ExplainMode";

export default function App() {
  return (
    <Router>
      <nav className="navbar">
        <Link to="/">Chat</Link>
        <Link to="/admin">Admin</Link>
        <Link to="/compare">Compare Drugs</Link>
        <Link to="/summarize">Summarize</Link>
        <Link to="/explain">Explain</Link>
      </nav>

      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/compare" element={<CompareDrugs />} />
        <Route path="/summarize" element={<SummarizeProtocol />} />
        <Route path="/explain" element={<ExplainMode />} />
      </Routes>
    </Router>
  );
}
