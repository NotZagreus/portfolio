import CV, { ICV } from "./cv";

export default class CVRepository {
  static async getAllCVs(): Promise<ICV[]> {
    return CV.find();
  }

  static async getCVById(id: string): Promise<ICV | null> {
    return CV.findById(id);
  }

  static async updateCV(id: string, data: Partial<ICV>): Promise<ICV | null> {
    return CV.findByIdAndUpdate(id, data, { new: true });
  }
}
