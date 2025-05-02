"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const portfolioRepository_1 = __importDefault(require("../datalayer/portfolioRepository"));
class PortfolioService {
    static getPortfolio() {
        return __awaiter(this, void 0, void 0, function* () {
            return portfolioRepository_1.default.getAllPortfolio();
        });
    }
    static getPortfolioById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const portfolio = yield portfolioRepository_1.default.getPortfolioById(id);
            if (!portfolio) {
                throw new Error("Portfolio not found");
            }
            return portfolio;
        });
    }
    static createPortfolio(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.titleEn || !data.titleFr) {
                throw new Error("Title in English and French are required");
            }
            return portfolioRepository_1.default.addPortfolio(data);
        });
    }
    static updatePortfolio(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const portfolio = yield portfolioRepository_1.default.updatePortfolio(id, data);
            if (!portfolio) {
                throw new Error("Portfolio not found");
            }
            return portfolio;
        });
    }
    static deletePortfolio(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const portfolio = yield portfolioRepository_1.default.deletePortfolio(id);
            if (!portfolio) {
                throw new Error("Portfolio not found");
            }
            return portfolio;
        });
    }
}
exports.default = PortfolioService;
