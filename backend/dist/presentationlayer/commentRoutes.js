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
const commentService_1 = __importDefault(require("../businesslayer/commentService"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield commentService_1.default.getComments();
        res.json(comments);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comment = yield commentService_1.default.getCommentById(req.params.id);
        res.json(comment);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comment = yield commentService_1.default.createComment(req.body);
        res.status(201).json(comment);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
router.put("/:id", auth_1.checkJwt, (0, auth_1.checkPermissions)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comment = yield commentService_1.default.updateComment(req.params.id, req.body);
        res.json(comment);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}));
router.patch("/:id", auth_1.checkJwt, (0, auth_1.checkPermissions)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comment = yield commentService_1.default.updateComment(req.params.id, req.body);
        res.json(comment);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}));
router.delete("/:id", auth_1.checkJwt, (0, auth_1.checkPermissions)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comment = yield commentService_1.default.deleteComment(req.params.id);
        res.json(comment);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}));
exports.default = router;
