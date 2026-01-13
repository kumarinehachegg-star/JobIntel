import { Router } from "express";
import { sitemapXml, robotsTxt } from "../controllers/seoController";

const router = Router();

router.get("/sitemap.xml", sitemapXml);
router.get("/robots.txt", robotsTxt);

export default router;
