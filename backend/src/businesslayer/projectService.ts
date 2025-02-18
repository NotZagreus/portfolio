import ProjectRepository from "../datalayer/projectRepository";
import { IProject } from "../datalayer/project";
import express, { Request } from "express";
import multer from "multer";
import ProjectService from "../businesslayer/projectService";
import { checkJwt, checkPermissions } from "../middleware/auth";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, fieldSize: 25 * 1024 * 1024 },
});

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

router.get("/", async (_, res) => {
  try {
    const projects = await ProjectService.getProjects();
    res.json(projects);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const project = await ProjectService.getProjectById(req.params.id);
    res.json(project);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
});

router.post(
  "/",
  checkJwt,
  checkPermissions(),
  upload.single("image"),
  async (req: MulterRequest, res) => {
    try {
      const projectData = req.body;
      if (req.file) {
        projectData.image = req.file.buffer.toString("base64");
      }
      const project = await ProjectService.createProject(projectData);
      res.status(201).json(project);
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
  async (req: MulterRequest, res) => {
    try {
      const projectData = req.body;
      if (req.file) {
        projectData.image = req.file.buffer.toString("base64");
      }
      const project = await ProjectService.updateProject(req.params.id, projectData);
      res.json(project);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }
);

router.delete("/:id", checkJwt, checkPermissions(), async (req, res) => {
  try {
    const project = await ProjectService.deleteProject(req.params.id);
    res.json(project);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
});

export default router;

export default class ProjectService {
  static async getProjects(): Promise<IProject[]> {
    return ProjectRepository.getAllProjects();
  }

  static async getProjectById(id: string): Promise<IProject | null> {
    const project = await ProjectRepository.getProjectById(id);
    if (!project) {
      throw new Error("Project not found");
    }
    return project;
  }

  static async createProject(data: Partial<IProject>): Promise<IProject> {
    if (!data.title || !data.description) {
      throw new Error("Title and description are required");
    }
    return ProjectRepository.addProject(data);
  }

  static async updateProject(
    id: string,
    data: Partial<IProject>
  ): Promise<IProject | null> {
    const project = await ProjectRepository.updateProject(id, data);
    if (!project) {
      throw new Error("Project not found");
    }
    return project;
  }

  static async deleteProject(id: string): Promise<IProject | null> {
    const project = await ProjectRepository.deleteProject(id);
    if (!project) {
      throw new Error("Project not found");
    }
    return project;
  }
}
