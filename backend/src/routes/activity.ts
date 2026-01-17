import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { Application } from "../models/Application";
import { Request, Response } from "express";

const router = Router();

// Get recent activity for user
router.get("/recent", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const applications = await Application.find({ userId })
      .populate('jobId', 'title company location')
      .lean()
      .limit(5)
      .sort({ createdAt: -1 });

    const activity = applications.map(app => ({
      id: app._id,
      type: 'application',
      title: `Applied to ${(app as any).jobId?.title || 'Job'}`,
      company: (app as any).jobId?.company || 'Company',
      location: (app as any).jobId?.location || 'Remote',
      timestamp: app.createdAt,
      status: app.status,
    }));

    return res.json(activity);
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Failed to get activity" });
  }
});

export default router;
