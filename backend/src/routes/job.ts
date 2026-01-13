import { Router } from "express";
import { createJob, getJob, listJobs, ingestJob, updateJob, deleteJob, parseJobText } from "../controllers/jobController";

const router = Router();

// Log all requests to this router
router.use((req, res, next) => {
  console.log(`Job Route: ${req.method} ${req.path}`);
  next();
});

router.post("/parse", parseJobText);
router.post("/", createJob);
router.get("/", listJobs);
router.get("/:id", getJob);
router.patch("/:id", updateJob);
router.delete("/:id", deleteJob);
router.post("/ingest", ingestJob);

export default router;
