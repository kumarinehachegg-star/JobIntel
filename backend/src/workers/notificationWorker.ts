import { Worker, QueueScheduler } from "bullmq";
import IORedis from "ioredis";
import { sendEmail } from "../notifications/emailAdapter";
import { sendTelegram } from "../notifications/telegramAdapter";
import { sendWhatsApp } from "../notifications/whatsappAdapter";
import { NotificationLog } from "../models/NotificationLog";
import { User } from "../models/User";

const redisUrl = process.env.REDIS_URL;

async function attemptAdapters(payload: any) {
  const { toUserId, subject, text } = payload;
  const user = toUserId ? await User.findById(toUserId).lean() : null;

  const attempts: any[] = [];

  // Try email if user opts in
  if ((user && user.notificationPrefs?.email) || payload.preferredChannels?.includes("email")) {
    try {
      await sendEmail(payload.toEmail || (user && user.email), subject || payload.title || "Notification", text || payload.body || "");
      attempts.push({ channel: "email", success: true });
    } catch (err) {
      attempts.push({ channel: "email", success: false, error: err?.message || err });
    }
  }

  // Telegram
  if ((user && user.notificationPrefs?.telegram) || payload.preferredChannels?.includes("telegram")) {
    try {
      await sendTelegram(payload.telegramChatId || (user && (user as any).telegramId), text || payload.body || "");
      attempts.push({ channel: "telegram", success: true });
    } catch (err) {
      attempts.push({ channel: "telegram", success: false, error: err?.message || err });
    }
  }

  // WhatsApp
  if ((user && user.notificationPrefs?.whatsapp) || payload.preferredChannels?.includes("whatsapp")) {
    try {
      await sendWhatsApp(payload.whatsappNumber || (user && (user as any).phone), text || payload.body || "");
      attempts.push({ channel: "whatsapp", success: true });
    } catch (err) {
      attempts.push({ channel: "whatsapp", success: false, error: err?.message || err });
    }
  }

  // Persist log
  try {
    await NotificationLog.create({ toUserId: toUserId || null, payload, attempts });
  } catch (e) {
    // ignore
  }

  return attempts;
}

export async function processNotificationInline(payload: any) {
  return attemptAdapters(payload);
}

if (redisUrl) {
  const connection = new IORedis(redisUrl);
  new QueueScheduler("notifications", { connection });
  const worker = new Worker(
    "notifications",
    async (job) => {
      await attemptAdapters(job.data);
    },
    { connection }
  );

  worker.on("failed", (job, err) => {
    // log failure
    // eslint-disable-next-line no-console
    console.error("notification job failed", job.id, err?.message || err);
  });
}
