import express from "express";
const router = express.Router();

router.post("/protocol", async (req, res) => {
  try {
    const resp = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: `Summarize protocol steps from the uploaded guidelines: ${req.body.query}`,
        role: "doctor",
      }),
    });
    const data = await resp.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
