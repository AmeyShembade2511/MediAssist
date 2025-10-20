import express from "express";
const router = express.Router();

let docs = []; // manage guideline docs metadata

router.get("/docs", (_, res) => res.json(docs));

router.post("/upload-meta", (req, res) => {
  const { title, tag, version, source } = req.body;
  docs.push({ id: Date.now(), title, tag, version, source });
  res.json({ message: "Metadata added", docs });
});

router.post("/reindex", (req, res) => {
  // call FastAPI /upload to reindex
  res.json({ message: "Reindex triggered (stub)" });
});

export default router;
