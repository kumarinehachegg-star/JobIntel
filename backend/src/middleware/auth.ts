import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import dotenv from "dotenv";

// Ensure env is loaded
if (!process.env.JWT_SECRET) {
  dotenv.config();
}

const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret_9f3a2b4c";

export interface AuthRequest extends Request {
  user?: any;
}

export async function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"] as string | undefined;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    const payload: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.sub).select("email roles tier");
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export function requireRole(role: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    if (!req.user.roles || !req.user.roles.includes(role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}
