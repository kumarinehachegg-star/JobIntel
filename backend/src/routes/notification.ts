import { Router } from "express";
import { sendNotification } from "../controllers/notificationController";
import IORedis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const router = Router();

router.post("/send", sendNotification);

// Server-Sent Events stream for realtime notifications
router.get('/stream', async (req, res) => {
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');
	res.flushHeaders && res.flushHeaders();

	const sub = new IORedis(REDIS_URL);
	const channels = ['realtime:notifications', 'realtime:applications', 'realtime:users'];

	const onMessage = (_chan: string, message: string) => {
		try {
			res.write(`data: ${message}\n\n`);
		} catch (err) {
			// ignore
		}
	};

	await sub.subscribe(...channels);
	sub.on('message', onMessage);

	req.on('close', () => {
		sub.removeListener('message', onMessage);
		// unsubscribe from all subscribed channels then disconnect
		sub.unsubscribe(...channels).finally(() => sub.disconnect());
	});
});

export default router;
