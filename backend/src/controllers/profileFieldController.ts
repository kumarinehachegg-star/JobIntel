import { Request, Response } from 'express';
import { ProfileField } from '../models/ProfileField';

export const getPublicProfileFields = async (_req: Request, res: Response) => {
  try {
    const items = await ProfileField.find().sort({ createdAt: 1 }).lean();
    return res.json(items);
  } catch (err: any) {
    console.error('getPublicProfileFields', err);
    return res.status(500).json({ error: err?.message || 'server error' });
  }
};
