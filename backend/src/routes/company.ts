import { Router } from "express";
import { createCompany, getCompany, listCompanies, updateCompany } from "../controllers/companyController";

const router = Router();

router.post("/", createCompany);
router.get("/", listCompanies);
router.get(":id", getCompany);
router.patch(":id", updateCompany);

export default router;
