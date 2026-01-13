import { Request, Response } from "express";
import { Company } from "../models/Company";

export async function createCompany(req: Request, res: Response) {
  try {
    const payload = req.body;
    const company = await Company.create(payload);
    return res.status(201).json(company);
  } catch (err) {
    return res.status(500).json({ error: "failed to create company", details: err });
  }
}

export async function getCompany(req: Request, res: Response) {
  try {
    const c = await Company.findById(req.params.id).lean();
    if (!c) return res.status(404).json({ error: "not found" });
    return res.json(c);
  } catch (err) {
    return res.status(500).json({ error: "failed to get company", details: err });
  }
}

export async function listCompanies(req: Request, res: Response) {
  try {
    const q: any = {};
    if (req.query.name) q.name = { $regex: req.query.name as string, $options: "i" };
    const items = await Company.find(q).limit(100).lean();
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ error: "failed to list companies", details: err });
  }
}

export async function updateCompany(req: Request, res: Response) {
  try {
    const updates = req.body;
    const c = await Company.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true }).lean();
    if (!c) return res.status(404).json({ error: "not found" });
    return res.json(c);
  } catch (err) {
    return res.status(500).json({ error: "failed to update company", details: err });
  }
}
