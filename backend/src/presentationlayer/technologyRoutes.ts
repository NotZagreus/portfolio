import express from "express";
import multer from "multer";
import TechnologyService from "../businesslayer/technologyService";
import { checkJwt, checkPermissions } from "../middleware/auth";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, fieldSize: 25 * 1024 * 1024 },
});

router.get("/", async (_, res) => {
  try {
    const technologies = await TechnologyService.getTechnologies();
    res.json(technologies);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const technology = await TechnologyService.getTechnologyById(req.params.id);
    res.json(technology);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
});

router.post(
  "/",
  checkJwt,
  checkPermissions(),
  upload.single("image"),
  async (req, res) => {
    try {
      const technologyData = req.body;
      if (req.file) {
        technologyData.image = req.file.buffer.toString("base64");
      }
      const technology = await TechnologyService.createTechnology(
        technologyData
      );
      res.status(201).json(technology);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
);

router.put(
  "/:id",
  checkJwt,
  checkPermissions(),
  upload.single("image"),
  async (req, res) => {
    try {
      const technologyData = req.body;
      if (req.file) {
        technologyData.image = req.file.buffer.toString("base64");
      }
      const technology = await TechnologyService.updateTechnology(
        req.params.id,
        technologyData
      );
      res.json(technology);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }
);

router.delete("/:id", checkJwt, checkPermissions(), async (req, res) => {
  try {
    const technology = await TechnologyService.deleteTechnology(req.params.id);
    res.json(technology);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
