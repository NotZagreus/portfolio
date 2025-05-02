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
const express_1 = __importDefault(require("express"));
const portfolioService_1 = __importDefault(require("../businesslayer/portfolioService"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get("/", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const portfolio = yield portfolioService_1.default.getPortfolio();
        res.json(portfolio);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const portfolio = yield portfolioService_1.default.getPortfolioById(req.params.id);
        res.json(portfolio);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const portfolio = yield portfolioService_1.default.createPortfolio(req.body);
        res.status(201).json(portfolio);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
router.put("/:id", auth_1.checkJwt, (0, auth_1.checkPermissions)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const portfolio = yield portfolioService_1.default.updatePortfolio(req.params.id, req.body);
        res.json(portfolio);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}));
router.delete("/:id", auth_1.checkJwt, (0, auth_1.checkPermissions)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const portfolio = yield portfolioService_1.default.deletePortfolio(req.params.id);
        res.json(portfolio);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}));
exports.default = router;
