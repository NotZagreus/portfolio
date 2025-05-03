import Technology, { ITechnology } from "./technology";

export default class TechnologyRepository {
  static async getAllTechnologies(): Promise<ITechnology[]> {
    return Technology.find();
  }

  static async getTechnologyById(id: string): Promise<ITechnology | null> {
    return Technology.findById(id);
  }

  static async addTechnology(data: Partial<ITechnology>): Promise<ITechnology> {
    const project = new Technology(data);
    return project.save();
  }

  static async updateTechnology(
    id: string,
    data: Partial<ITechnology>
  ): Promise<ITechnology | null> {
    return Technology.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteTechnology(id: string): Promise<ITechnology | null> {
    return Technology.findByIdAndDelete(id);
  }
}
