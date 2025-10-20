import React, { useState } from "react";
import { uploadFiles } from "../api";

export default function FileUploader() {
  const [files, setFiles] = useState([]);
  const [result, setResult] = useState([]);

  const handleUpload = async () => {
    const resp = await uploadFiles(files);
    setResult(resp);
  };

  return (
    <div className="file-uploader">
      <input type="file" multiple onChange={(e) => setFiles([...e.target.files])} />
      <button onClick={handleUpload}>Upload</button>
      <ul>
        {result.map((r, i) => (
          <li key={i}>
            {r.filename} – {r.chunks_uploaded} chunks
          </li>
        ))}
      </ul>
    </div>
  );
}
