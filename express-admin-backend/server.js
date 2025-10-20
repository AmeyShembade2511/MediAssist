import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import feedbackRoutes from "./routes/feedback.js";
import adminRoutes from "./routes/admin.js";
import summaryRoutes from "./routes/summary.js";

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));

// Mount routes
app.use("/feedback", feedbackRoutes);
app.use("/admin", adminRoutes);
app.use("/summary", summaryRoutes);

// Proxy to FastAPI RAG backend
app.post("/chat", async (req, res) => {
  try {
    const resp = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const data = await resp.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/upload", async (req, res) => {
  try {
    const resp = await fetch("http://127.0.0.1:8000/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const data = await resp.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("✅ Express API running on http://127.0.0.1:5000"));
