import Project, { IProject } from './project';

export default class ProjectRepository {
  static async getAllProjects(): Promise<IProject[]> {
    return Project.find();
  }

  static async addProject(data: Partial<IProject>): Promise<IProject> {
    const project = new Project(data);
    return project.save();
  }

  static async getProjectById(id: string): Promise<IProject | null> {
    return Project.findById(id);
  }
}
