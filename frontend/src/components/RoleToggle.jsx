import React from "react";

export default function RoleToggle({ role, onChange }) {
  return (
    <div className="role-toggle">
      <label>Explain as:</label>
      <select value={role} onChange={(e) => onChange(e.target.value)}>
        <option value="doctor">Doctor</option>
        <option value="student">Medical Student</option>
        <option value="patient">Patient</option>
      </select>
    </div>
  );
}
