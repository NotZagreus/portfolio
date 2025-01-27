import Project, { IProject } from './project';

export default class ProjectRepository {
  static async getAllProjects(): Promise<IProject[]> {
    return Project.find();
  }

  static async getProjectById(id: string): Promise<IProject | null> {
    return Project.findById(id);
  }

  static async addProject(data: Partial<IProject>): Promise<IProject> {
    const project = new Project(data);
    return project.save();
  }
  
  static async updateProject(id: string, data: Partial<IProject>): Promise<IProject | null> {
    return Project.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteProject(id: string): Promise<IProject | null> {
    return Project.findByIdAndDelete(id);
  }
}
