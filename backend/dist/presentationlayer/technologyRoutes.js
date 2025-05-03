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
const multer_1 = __importDefault(require("multer"));
const technologyService_1 = __importDefault(require("../businesslayer/technologyService"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024, fieldSize: 25 * 1024 * 1024 },
});
router.get("/", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const technologies = yield technologyService_1.default.getTechnologies();
        res.json(technologies);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const technology = yield technologyService_1.default.getTechnologyById(req.params.id);
        res.json(technology);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}));
router.post("/", auth_1.checkJwt, (0, auth_1.checkPermissions)(), upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const technologyData = req.body;
        if (req.file) {
            technologyData.image = req.file.buffer.toString("base64");
        }
        const technology = yield technologyService_1.default.createTechnology(technologyData);
        res.status(201).json(technology);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
router.put("/:id", auth_1.checkJwt, (0, auth_1.checkPermissions)(), upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const technologyData = req.body;
        if (req.file) {
            technologyData.image = req.file.buffer.toString("base64");
        }
        const technology = yield technologyService_1.default.updateTechnology(req.params.id, technologyData);
        res.json(technology);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}));
router.delete("/:id", auth_1.checkJwt, (0, auth_1.checkPermissions)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const technology = yield technologyService_1.default.deleteTechnology(req.params.id);
        res.json(technology);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}));
exports.default = router;
