import PDFDocument from "pdfkit";
import fs from "fs";

/**
 * Generate a simple PDF report containing the LLM answer,
 * snippet citations, and metadata.
 */
export function generatePdfReport({ question, answer, citations, filename = "report.pdf" }) {
  const doc = new PDFDocument();
  const outPath = `./reports/${filename}`;
  fs.mkdirSync("./reports", { recursive: true });
  const stream = fs.createWriteStream(outPath);
  doc.pipe(stream);

  doc.fontSize(18).text("MediAssist Report", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Question: ${question}`);
  doc.moveDown();
  doc.text("Answer:", { underline: true });
  doc.text(answer);
  doc.moveDown();
  doc.text("Citations:", { underline: true });
  (citations || []).forEach((c, i) => {
    doc.text(`${i + 1}. ${c.source || "unknown"} - chunk ${c.chunk_index || "n/a"}`);
  });

  doc.end();
  return outPath;
}
