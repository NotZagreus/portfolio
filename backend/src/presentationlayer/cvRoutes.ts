import express from "express";
import CVService from "../businesslayer/cvService";
import { checkJwt, checkPermissions } from "../middleware/auth";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const CVs = await CVService.getCVs();
    res.json(CVs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", checkJwt, checkPermissions(), async (req, res) => {
  try {
    const CV = await CVService.updateCV(req.params.id, req.body);
    res.json(CV);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
