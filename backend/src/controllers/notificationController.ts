import { Request, Response } from "express";
import { enqueueNotification } from "../queues/notificationQueue";

export async function sendNotification(req: Request, res: Response) {
  try {
    const payload = req.body;
    const result = await enqueueNotification(payload);
    return res.json({ ok: true, enqueued: result.queued });
  } catch (err) {
    return res.status(500).json({ error: "failed to enqueue notification", details: err });
  }
}
