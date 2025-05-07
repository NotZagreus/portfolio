import express, { Request, Response } from "express";
import CVService from "../businesslayer/cvService";
import { checkJwt, checkPermissions } from "../middleware/auth";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const CVs = await CVService.getCVs();
    res.json(CVs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// @ts-expect-error
router.get("/:id/en", async (req: Request, res: Response) => {
  try {
    const cv = await CVService.getCVById(req.params.id);
    
    res.setHeader("Content-Type", "application/pdf");
    if (!cv) {
      return res.status(404).json({ message: "CV not found" });
    }
    res.send(cv.pdfFileEn);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// @ts-expect-error
router.get("/:id/fr", async (req: Request, res: Response) => {
  try {
    const cv = await CVService.getCVById(req.params.id);
    
    res.setHeader("Content-Type", "application/pdf");
    if (!cv) {
      return res.status(404).json({ message: "CV not found" });
    }
    res.send(cv.pdfFileFr);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", checkJwt, checkPermissions(), async (req: Request, res: Response) => {
  try {
    const CV = await CVService.updateCV(req.params.id, req.body);
    res.json(CV);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
});

export default router;