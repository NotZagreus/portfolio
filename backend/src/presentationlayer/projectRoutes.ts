import express from 'express';
import multer from 'multer';
import ProjectService from '../businesslayer/projectService';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', async (req, res) => {
  try {
    const projects = await ProjectService.getProjects();
    res.json(projects);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const project = await ProjectService.getProjectById(req.params.id);
    res.json(project);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const projectData = req.body;
    if (req.file) {
      projectData.image = req.file.buffer.toString('base64');
    }
    const project = await ProjectService.createProject(projectData);
    res.status(201).json(project);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const projectData = req.body;
    if (req.file) {
      projectData.image = req.file.buffer.toString('base64');
    }
    const project = await ProjectService.updateProject(req.params.id, projectData);
    res.json(project);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const project = await ProjectService.deleteProject(req.params.id);
    res.json(project);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
});

export default router;