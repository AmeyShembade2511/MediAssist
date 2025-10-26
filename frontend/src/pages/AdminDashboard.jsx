import React, { useState } from "react";
import { uploadFiles } from "../api";

export default function AdminDashboard() {
  const [files, setFiles] = useState([]);
  const [uploaded, setUploaded] = useState([]);
  const [tag, setTag] = useState("guideline");
  const [version, setVersion] = useState("1.0");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!files.length) return alert("Select files first!");
    setLoading(true);
    try {
      const data = await uploadFiles(files);
      setUploaded(data);
      setFiles([]);
    } catch (err) {
      console.error(err);
      alert("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2 className="admin-title">📚 Admin Dashboard</h2>

      <div className="upload-section">
        <input
          type="file"
          multiple
          className="file-input"
          onChange={(e) => setFiles([...e.target.files])}
        />

        <input
          type="text"
          placeholder="Version"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          className="text-input"
        />

        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="select-input"
        >
          <option value="guideline">Guideline</option>
          <option value="drug">Drug Info</option>
          <option value="consensus">Consensus Doc</option>
        </select>

        <button onClick={handleUpload} className="upload-btn" disabled={loading}>
          {loading ? "Uploading..." : "Upload & Index"}
        </button>
      </div>

      <h3 className="uploaded-title">Indexed Documents</h3>
      {uploaded.length === 0 && <p>No documents uploaded yet.</p>}
      <div className="uploaded-list">
        {Array.isArray(uploaded) &&
          uploaded.map((u, i) => (
            <div key={i} className="uploaded-card">
              <strong>{u.filename}</strong>
              <p>{u.chunks_uploaded} chunks indexed</p>
            </div>
          ))}
      </div>
    </div>
  );
}
