import express, { Request, Response } from "express";
import CVService from "../businesslayer/cvService";
import { checkJwt, checkPermissions } from "../middleware/auth";
import CV, { ICV } from "../datalayer/cv";
import multer from "multer";

const router = express.Router();
const upload = multer();

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

// router.put("/:id", checkJwt, checkPermissions(), async (req: Request, res: Response) => {
//   try {
//     const CV = await CVService.updateCV(req.params.id, req.body);
//     res.json(CV);
//   } catch (error: any) {
//     res.status(404).json({ message: error.message });
//   }
// });

router.put(
  "/:id",
  checkJwt,
  checkPermissions(),
  upload.fields([
    { name: "pdfFileEn", maxCount: 1 },
    { name: "pdfFileFr", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const updateData: Partial<ICV> = {
        pdfFileEn: files["pdfFileEn"]?.[0]?.buffer,
        pdfFileFr: files["pdfFileFr"]?.[0]?.buffer,
      };

      const updatedCV = await CVService.updateCV(req.params.id, updateData);
      res.json(updatedCV);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;
