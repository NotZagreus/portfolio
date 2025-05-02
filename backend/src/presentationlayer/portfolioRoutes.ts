import express from "express";
import PortfolioService from "../businesslayer/portfolioService";
import { checkJwt, checkPermissions } from "../middleware/auth";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const portfolios = await PortfolioService.getPortfolios();
    res.json(portfolios);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const portfolio = await PortfolioService.getPortfolioById(req.params.id);
    res.json(portfolio);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const portfolio = await PortfolioService.createPortfolio(req.body);
    res.status(201).json(portfolio);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", checkJwt, checkPermissions(), async (req, res) => {
  try {
    const portfolio = await PortfolioService.updatePortfolio(
      req.params.id,
      req.body
    );
    res.json(portfolio);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
});

router.delete("/:id", checkJwt, checkPermissions(), async (req, res) => {
  try {
    const portfolio = await PortfolioService.deletePortfolio(req.params.id);
    res.json(portfolio);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
