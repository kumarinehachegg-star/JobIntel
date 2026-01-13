import { Queue } from "bullmq";
import IORedis from "ioredis";
import { processNotificationInline } from "../workers/notificationWorker";

const connection = process.env.REDIS_URL ? new IORedis(process.env.REDIS_URL) : null;

let notificationQueue: Queue | null = null;

if (connection) {
  notificationQueue = new Queue("notifications", { connection });
}

export async function enqueueNotification(payload: any) {
  if (notificationQueue) {
    await notificationQueue.add("send", payload, { attempts: 3, backoff: { type: "exponential", delay: 1000 } });
    return { queued: true };
  }

  // fallback: process inline
  await processNotificationInline(payload);
  return { queued: false };
}

export default notificationQueue;
