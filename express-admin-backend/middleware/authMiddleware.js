// backend/express/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Missing Authorization header" });

  const parts = auth.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return res.status(401).json({ error: "Invalid Authorization header format" });

  const token = parts[1];
  try {
    const payload = jwt.verify(token, ACCESS_SECRET);
    req.user = payload; // e.g., {userId, email, role, iat, exp}
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
