import { Request, Response } from 'express';
import { Source } from '../models/Source';

export async function listSources(_req: Request, res: Response) {
  const sources = await Source.find().lean();
  res.json(sources);
}

export async function getSource(req: Request, res: Response) {
  const { id } = req.params;
  const s = await Source.findById(id).lean();
  if (!s) return res.status(404).json({ message: 'Not found' });
  res.json(s);
}

export async function createSource(req: Request, res: Response) {
  const payload = req.body;
  try {
    const s = await Source.create(payload);
    res.status(201).json(s);
  } catch (err) {
    res.status(400).json({ message: err?.message || 'Invalid' });
  }
}

export async function updateSource(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const s = await Source.findByIdAndUpdate(id, req.body, { new: true }).lean();
    if (!s) return res.status(404).json({ message: 'Not found' });
    res.json(s);
  } catch (err) {
    res.status(400).json({ message: err?.message || 'Invalid' });
  }
}

export async function deleteSource(req: Request, res: Response) {
  const { id } = req.params;
  await Source.findByIdAndDelete(id);
  res.json({ ok: true });
}
