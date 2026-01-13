import { Router } from "express";
import { createApplication, listApplications, deleteApplication } from "../controllers/applicationController";

const router = Router();

router.post("/", createApplication);
router.get("/", listApplications);
router.delete("/:id", deleteApplication);

export default router;
