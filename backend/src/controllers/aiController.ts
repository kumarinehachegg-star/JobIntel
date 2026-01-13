import { Request, Response } from 'express';
import aiClient from '../services/aiClient';

export async function parseJobController(req: Request, res: Response) {
  const payload = req.body;
  if (!payload || (!payload.html && !payload.text)) return res.status(400).json({ message: 'html or text required' });
  const out = await aiClient.parseJob({ html: payload.html, text: payload.text });
  res.json(out);
}

export async function matchController(req: Request, res: Response) {
  const { job, candidate } = req.body;
  if (!job || !candidate) return res.status(400).json({ message: 'job and candidate required' });
  const out = await aiClient.matchCandidate(job, candidate);
  res.json(out);
}

export async function coverController(req: Request, res: Response) {
  const { job, candidate } = req.body;
  if (!job || !candidate) return res.status(400).json({ message: 'job and candidate required' });
  const out = await aiClient.generateCoverLetter(job, candidate);
  res.json(out);
}
