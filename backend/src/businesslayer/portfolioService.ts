import { IPortfolio } from "../datalayer/portfolio";
import PortfolioRepository from "../datalayer/portfolioRepository";

export default class PortfolioService {
  static async getPortfolios(): Promise<IPortfolio[]> {
    return PortfolioRepository.getAllPortfolios();
  }

  static async getPortfolioById(id: string): Promise<IPortfolio | null> {
    const portfolio = await PortfolioRepository.getPortfolioById(id);
    if (!portfolio) {
      throw new Error("Portfolio not found");
    }
    return portfolio;
  }

  static async createPortfolio(data: Partial<IPortfolio>): Promise<IPortfolio> {
    if (!data.titleEn || !data.titleFr) {
      throw new Error("Title in English and French are required");
    }
    return PortfolioRepository.addPortfolio(data);
  }

  static async updatePortfolio(
    id: string,
    data: Partial<IPortfolio>
  ): Promise<IPortfolio | null> {
    const portfolio = await PortfolioRepository.updatePortfolio(id, data);
    if (!portfolio) {
      throw new Error("Portfolio not found");
    }
    return portfolio;
  }

  static async deletePortfolio(id: string): Promise<IPortfolio | null> {
    const portfolio = await PortfolioRepository.deletePortfolio(id);
    if (!portfolio) {
      throw new Error("Portfolio not found");
    }
    return portfolio;
  }
}
