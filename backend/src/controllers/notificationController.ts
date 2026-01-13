import { Request, Response } from "express";
import { enqueueNotification } from "../queues/notificationQueue";
import { Application } from "../models/Application";
import mongoose from "mongoose";

export async function sendNotification(req: Request, res: Response) {
  try {
    const payload = req.body || {};

    // If jobId(s) specified, expand recipients to applicants of those job(s)
    const jobIds: string[] = [];
    if (payload.jobId) jobIds.push(payload.jobId);
    if (Array.isArray(payload.jobIds)) jobIds.push(...payload.jobIds);

    if (jobIds.length > 0) {
      // find applications for these jobs and collect distinct userIds
      const objectIds = jobIds.map((j) => mongoose.Types.ObjectId(j));
      const apps = await Application.find({ jobId: { $in: objectIds } }).select('userId jobId').lean();
      const userIdSet = new Set<string>();
      for (const a of apps) {
        if (a.userId) userIdSet.add(a.userId.toString());
      }

      if (userIdSet.size === 0) {
        return res.status(200).json({ ok: true, queued: false, recipients: 0, message: 'No applicants found for provided job(s)' });
      }

      // enqueue for each recipient
      let enqueuedCount = 0;
      for (const uid of userIdSet) {
        // copy payload but set toUserId
        const individual = { ...payload, toUserId: uid, jobIds, jobId: jobIds.length === 1 ? jobIds[0] : undefined };
        await enqueueNotification(individual);
        enqueuedCount++;
      }

      return res.json({ ok: true, queued: true, recipients: enqueuedCount });
    }

    // fallback: enqueue single notification as provided (e.g., toUserId or broadcast)
    const result = await enqueueNotification(payload);
    return res.json({ ok: true, enqueued: result.queued });
  } catch (err) {
    return res.status(500).json({ error: "failed to enqueue notification", details: String(err) });
  }
}
