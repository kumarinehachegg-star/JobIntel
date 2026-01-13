import { Request, Response } from 'express';
import { Job } from '../models/Job';
import { Skill } from '../models/Skill';

export const getSkills = async (_req: Request, res: Response) => {
  try {
    // try to collect distinct tech stack entries from jobs
    const jobSkills = await Job.distinct('meta.techStack');
    const adminSkillsDocs = await Skill.find().lean();
    const adminSkills = (adminSkillsDocs || []).map((s: any) => String(s.name));
    // distinct may return nested arrays; normalize
    const flat: string[] = [];
    ((jobSkills || []) as any[]).forEach((s: any) => {
      if (!s) return;
      if (Array.isArray(s)) s.forEach((x) => x && flat.push(String(x)));
      else flat.push(String(s));
    });
    // merge admin skills and job-derived skills
    const merged = Array.from(new Set([...flat.map((s) => s.trim()), ...adminSkills])).filter(Boolean);
    const uniq = merged.sort((a, b) => a.localeCompare(b));
    return res.json(uniq);
  } catch (err: any) {
    console.error('getSkills error', err);
    return res.status(500).json({ error: err?.message || 'server error' });
  }
};
