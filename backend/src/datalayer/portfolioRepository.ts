import Portfolio, { IPortfolio } from "./portfolio";

export default class PortfolioRepository {
  static async getAllPortfolios(): Promise<IPortfolio[]> {
    return Portfolio.find();
  }

  static async getPortfolioById(id: string): Promise<IPortfolio | null> {
    return Portfolio.findById(id);
  }

  static async addPortfolio(data: Partial<IPortfolio>): Promise<IPortfolio> {
    const portfolio = new Portfolio(data);
    return portfolio.save();
  }

  static async updatePortfolio(
    id: string,
    data: Partial<IPortfolio>
  ): Promise<IPortfolio | null> {
    return Portfolio.findByIdAndUpdate(id, data, { new: true });
  }

  static async deletePortfolio(id: string): Promise<IPortfolio | null> {
    return Portfolio.findByIdAndDelete(id);
  }
}
