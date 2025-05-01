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
const portfolio_1 = __importDefault(require("./portfolio"));
class PortfolioRepository {
    static getAllPortfolio() {
        return __awaiter(this, void 0, void 0, function* () {
            return portfolio_1.default.find();
        });
    }
    static getPortfolioById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return portfolio_1.default.findById(id);
        });
    }
    static addPortfolio(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const portfolio = new portfolio_1.default(data);
            return portfolio.save();
        });
    }
    static updatePortfolio(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return portfolio_1.default.findByIdAndUpdate(id, data, { new: true });
        });
    }
    static deletePortfolio(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return portfolio_1.default.findByIdAndDelete(id);
        });
    }
}
exports.default = PortfolioRepository;
