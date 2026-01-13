import { Router } from "express";
import path from "path";

const router = Router();

router.get("/openapi.yaml", (_req, res) => {
  const p = path.resolve(process.cwd(), "docs", "openapi.yaml");
  res.sendFile(p);
});

export default router;
