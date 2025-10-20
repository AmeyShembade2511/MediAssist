import express from "express";
const router = express.Router();

let feedbackStore = [];

router.post("/", (req, res) => {
  const { question, answer, feedback, correction } = req.body;
  const entry = { id: Date.now(), question, answer, feedback, correction };
  feedbackStore.push(entry);
  res.json({ message: "Feedback recorded", entry });
});

router.get("/", (req, res) => {
  res.json(feedbackStore);
});

export default router;
