// backend/express/routes/auth.js
import express from "express";
import db from "../db/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const router = express.Router();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXPIRES = parseInt(process.env.ACCESS_TOKEN_EXPIRES || "900", 10); // seconds
const REFRESH_EXPIRES = parseInt(process.env.REFRESH_TOKEN_EXPIRES || process.env.REFRESH_TOKEN_EXPIRES || (30*24*3600), 10);

// helper: generate tokens
function generateAccessToken(payload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: `${ACCESS_EXPIRES}s` });
}
function generateRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: `${REFRESH_EXPIRES}s` });
}

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, password, full_name } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email and password required" });
    console.log("Register attempt for email:-", email);
    console.log("Register attempt for password:-", password);
    console.log("Register attempt for full name:-", full_name);
    console.log("Connecting to database at:-", process.env.DATABASE_URL);
    console.log("JWT ACCESS SECRET:-",process.env.JWT_ACCESS_SECRET);
    // check existing user
    const exists = await db.query("SELECT id FROM users WHERE email=$1", [email.toLowerCase()]);
    if (exists.rows.length) return res.status(409).json({ error: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const result = await db.query(
      "INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id, email, full_name, role, created_at",
      [email.toLowerCase(), hash, full_name || null]
    );

    const user = result.rows[0];
    res.status(201).json({ user });
  } catch (err) {
    console.error("register err", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password, user_agent } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email and password required" });

    const result = await db.query("SELECT id, password_hash, email, full_name, role FROM users WHERE email=$1", [email.toLowerCase()]);
    if (!result.rows.length) return res.status(401).json({ error: "Invalid credentials" });

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    // Generate tokens
    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Save refresh token to DB
    const expiresAt = new Date(Date.now() + REFRESH_EXPIRES * 1000);
    await db.query(
      "INSERT INTO refresh_tokens (user_id, token, user_agent, expires_at) VALUES ($1, $2, $3, $4)",
      [user.id, refreshToken, user_agent || req.get("User-Agent") || null, expiresAt]
    );

    res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role }
    });
  } catch (err) {
    console.error("login err", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Refresh
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: "refreshToken required" });

    // Verify signature
    let payload;
    try {
      payload = jwt.verify(refreshToken, REFRESH_SECRET);
    } catch (e) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    // Check token exists in DB and not expired
    const row = await db.query("SELECT id, user_id, expires_at FROM refresh_tokens WHERE token=$1", [refreshToken]);
    if (!row.rows.length) return res.status(401).json({ error: "Refresh token not found" });

    const tokenRow = row.rows[0];
    if (new Date(tokenRow.expires_at) < new Date()) {
      // remove expired
      await db.query("DELETE FROM refresh_tokens WHERE id=$1", [tokenRow.id]);
      return res.status(401).json({ error: "Refresh token expired" });
    }

    // Issue new access token (and optionally new refresh token)
    const accessToken = generateAccessToken({ userId: payload.userId, email: payload.email, role: payload.role });

    res.json({ accessToken });
  } catch (err) {
    console.error("refresh err", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Logout (revoke refresh token)
router.post("/logout", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: "refreshToken required" });

    await db.query("DELETE FROM refresh_tokens WHERE token=$1", [refreshToken]);
    res.json({ message: "Logged out" });
  } catch (err) {
    console.error("logout err", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
