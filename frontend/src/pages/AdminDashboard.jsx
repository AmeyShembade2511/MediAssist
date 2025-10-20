import React, { useEffect, useState } from "react";
import { uploadFiles } from "../api";

export default function AdminDashboard() {
  const [files, setFiles] = useState([]);
  const [uploaded, setUploaded] = useState([]);
  const [tag, setTag] = useState("guideline");
  const [version, setVersion] = useState("1.0");

  const handleUpload = async () => {
    if (!files.length) return alert("Select files first!");
    const data = await uploadFiles(files);
    setUploaded(data);
  };

  return (
    <div className="admin-dashboard">
      <h2>📚 Admin Dashboard</h2>
      <div className="upload-section">
        <input
          type="file"
          multiple
          onChange={(e) => setFiles([...e.target.files])}
        />
        <input
          type="text"
          placeholder="Version"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
        />
        <select value={tag} onChange={(e) => setTag(e.target.value)}>
          <option value="guideline">Guideline</option>
          <option value="drug">Drug Info</option>
          <option value="consensus">Consensus Doc</option>
        </select>
        <button onClick={handleUpload}>Upload & Index</button>
      </div>

      <h3>Indexed Documents</h3>
      <ul>
        {Array.isArray(uploaded) && uploaded.map((u, i) => (
            <li key={i}>
            {u.filename} – {u.chunks_uploaded} chunks indexed
            </li>
        ))}
      </ul>
    </div>
  );
}
