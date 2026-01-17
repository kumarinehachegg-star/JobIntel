import { Request, Response } from "express";
import multer from "multer";
import { processResume, userHasResume } from "../services/resumeService";
import { getUserMatchingJobs } from "../services/matchingEngine";

// Configure multer for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and DOCX files are allowed"));
    }
  },
});

/**
 * Upload and process resume
 * POST /api/resume/upload
 */
export async function uploadResume(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log(
      `Processing resume for user ${user._id} (${req.file.originalname})`
    );

    const { resumeText, embedding, textHash } = await processResume(
      user._id.toString(),
      req.file.buffer,
      req.file.mimetype
    );

    return res.status(200).json({
      success: true,
      message: "Resume uploaded and processed successfully",
      resume: {
        fileName: req.file.originalname,
        fileSize: req.file.size,
        textLength: resumeText.length,
        embeddingDimensions: embedding.length,
        textHash,
      },
    });
  } catch (error) {
    console.error("Error uploading resume:", error);
    return res.status(500).json({
      error: "Failed to process resume",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Get resume status
 * GET /api/resume/status
 */
export async function getResumeStatus(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const hasResume = await userHasResume(user._id.toString());

    return res.json({
      id: user._id.toString(),
      hasResume,
      resumeText: hasResume ? user.resume?.rawText?.substring(0, 200) : null,
      lastUpdated: user.resume?.parsedAt || null,
      format: 'pdf',
      status: 'Processed',
      parsedAt: user.resume?.parsedAt || new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error getting resume status:", error);
    return res.status(500).json({ error: "Failed to get resume status" });
  }
}

/**
 * Delete user's resume
 * DELETE /api/resume/:id
 */
export async function deleteResume(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Clear the resume from the user document
    const { User } = await import("../models/User");
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $unset: { resume: 1 } },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting resume:", error);
    return res.status(500).json({ error: "Failed to delete resume" });
  }
}

/**
 * Download user's resume
 * GET /api/resume/download
 */
export async function downloadResume(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!user.resume?.rawText) {
      return res.status(404).json({ error: "No resume found" });
    }

    // Return resume as downloadable file
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
    res.send(user.resume.rawText);
  } catch (error) {
    console.error("Error downloading resume:", error);
    return res.status(500).json({ error: "Failed to download resume" });
  }
}

/**
 * Get matching jobs for user
 * GET /api/resume/matching-jobs
 */
export async function getMatchingJobs(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const minScore = parseInt(req.query.minScore as string) || 70;
    const matchingJobs = await getUserMatchingJobs(user._id.toString(), minScore);

    return res.json({
      count: matchingJobs.length,
      minScore,
      jobs: matchingJobs,
    });
  } catch (error) {
    console.error("Error getting matching jobs:", error);
    return res.status(500).json({ error: "Failed to get matching jobs" });
  }
}

export { upload };
