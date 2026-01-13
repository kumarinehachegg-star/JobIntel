import IORedis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

export function publishRealtime(channel: string, payload: any) {
  try {
    const pub = new IORedis(REDIS_URL);
    pub.publish(channel, JSON.stringify(payload)).finally(() => pub.disconnect());
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('publishRealtime failed', err?.message || err);
  }
}

export default publishRealtime;
