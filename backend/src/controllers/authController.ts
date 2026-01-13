import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import dotenv from "dotenv";

// Ensure env is loaded
if (!process.env.JWT_SECRET) {
  dotenv.config();
}

const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret_9f3a2b4c";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

export async function register(req: Request, res: Response) {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ message: "email and password required" });

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "User already exists" });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash: hash, name });
  return res.status(201).json({ id: user._id, email: user.email });
}

function signAccessToken(user: any) {
  return jwt.sign({ sub: user._id, roles: user.roles }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function signRefreshToken(user: any) {
  return jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "email and password required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  return res.json({ accessToken, refreshToken });
}

export async function refreshToken(req: Request, res: Response) {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: "Missing token" });
  try {
    const payload: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ message: "User not found" });
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    return res.json({ accessToken, refreshToken });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
