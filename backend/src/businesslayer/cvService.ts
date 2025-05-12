import { ICV } from "../datalayer/cv";
import CVRepository from "../datalayer/cvRepository";

export default class CVService {
  static async getCVs(): Promise<ICV[]> {
    return CVRepository.getAllCVs();
  }

  static async getCVById(id: string): Promise<ICV | null> {
    return CVRepository.getCVById(id);
  }

  static async updateCV(id: string, data: Partial<ICV>): Promise<ICV | null> {
    const CV = await CVRepository.updateCV(id, data);
    if (!CV) {
      throw new Error("CV not found");
    }
    return CV;
  }
}
