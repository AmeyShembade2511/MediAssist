const API_BASE = "http://127.0.0.1:5000";

export async function chatWithRag(question, role = "doctor") {
  const resp = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, role }),
  });
  return resp.json();
}

export async function uploadFiles(files) {
  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file); // key MUST be "files"
  }

  const res = await fetch("http://127.0.0.1:8000/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed: ${text}`);
  }

  return await res.json();
}


export async function sendFeedback(feedbackData) {
  const resp = await fetch(`${API_BASE}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(feedbackData),
  });
  return resp.json();
}

export async function registerUser({ email, password, full_name }) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, full_name }),
  });
  return res.json();
}

export async function loginUser({ email, password }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function refreshAccessToken(refreshToken) {
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  return res.json();
}

export async function logout(refreshToken) {
  const res = await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  return res.json();
}
