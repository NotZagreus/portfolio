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
const cvService_1 = __importDefault(require("../businesslayer/cvService"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const CVs = yield cvService_1.default.getCVs();
        res.json(CVs);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
// @ts-expect-error
router.get("/:id/en", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cv = yield cvService_1.default.getCVById(req.params.id);
        res.setHeader("Content-Type", "application/pdf");
        if (!cv) {
            return res.status(404).json({ message: "CV not found" });
        }
        res.send(cv.pdfFileEn);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
// @ts-expect-error
router.get("/:id/fr", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cv = yield cvService_1.default.getCVById(req.params.id);
        res.setHeader("Content-Type", "application/pdf");
        if (!cv) {
            return res.status(404).json({ message: "CV not found" });
        }
        res.send(cv.pdfFileFr);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.put("/:id", auth_1.checkJwt, (0, auth_1.checkPermissions)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const CV = yield cvService_1.default.updateCV(req.params.id, req.body);
        res.json(CV);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}));
exports.default = router;
