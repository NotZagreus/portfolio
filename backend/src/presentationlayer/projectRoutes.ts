import express from 'express';
import ProjectService from '../businesslayer/projectService';

const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await ProjectService.getProjects();
    res.json(projects);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new project
router.post('/', async (req, res) => {
  try {
    const project = await ProjectService.createProject(req.body);
    res.status(201).json(project);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
