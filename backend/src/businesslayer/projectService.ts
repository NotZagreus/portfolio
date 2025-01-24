import ProjectRepository from '../datalayer/projectRepository';
import { IProject } from '../datalayer/project';

export default class ProjectService {
  static async getProjects(): Promise<IProject[]> {
    return ProjectRepository.getAllProjects();
  }

  static async createProject(data: Partial<IProject>): Promise<IProject> {
    if (!data.title || !data.description) {
      throw new Error('Title and description are required');
    }
    return ProjectRepository.addProject(data);
  }

  static async getProjectById(id: string): Promise<IProject | null> {
    const project = await ProjectRepository.getProjectById(id);
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  }
}
