import TechnologyRepository from "../datalayer/technologyRepository";
import { ITechnology } from "../datalayer/technology";

export default class TechnologyService {
  static async getTechnologies(): Promise<ITechnology[]> {
    return TechnologyRepository.getAllTechnologies();
  }

  static async getTechnologyById(id: string): Promise<ITechnology | null> {
    const technology = await TechnologyRepository.getTechnologyById(id);
    if (!technology) {
      throw new Error("Technology not found");
    }
    return technology;
  }

  static async createTechnology(data: Partial<ITechnology>): Promise<ITechnology> {
    if (!data.name || !data.image) {
      throw new Error("Title and description are required");
    }
    return TechnologyRepository.addTechnology(data);
  }

  static async updateTechnology(
    id: string,
    data: Partial<ITechnology>
  ): Promise<ITechnology | null> {
    const technology = await TechnologyRepository.updateTechnology(id, data);
    if (!technology) {
      throw new Error("Technology not found");
    }
    return technology;
  }

  static async deleteTechnology(id: string): Promise<ITechnology | null> {
    const technology = await TechnologyRepository.deleteTechnology(id);
    if (!technology) {
      throw new Error("Technology not found");
    }
    return technology;
  }
}
