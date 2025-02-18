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
const commentRepository_1 = __importDefault(require("../datalayer/commentRepository"));
class CommentService {
    static getComments() {
        return __awaiter(this, void 0, void 0, function* () {
            return commentRepository_1.default.getAllComments();
        });
    }
    static getCommentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield commentRepository_1.default.getCommentById(id);
            if (!comment) {
                throw new Error("Comment not found");
            }
            return comment;
        });
    }
    static createComment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.firstName || !data.lastName || !data.comment) {
                throw new Error("First name, last name and comment are required");
            }
            return commentRepository_1.default.addComment(data);
        });
    }
    static updateComment(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield commentRepository_1.default.updateComment(id, data);
            if (!comment) {
                throw new Error("Comment not found");
            }
            return comment;
        });
    }
    static deleteComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield commentRepository_1.default.deleteComment(id);
            if (!comment) {
                throw new Error("Comment not found");
            }
            return comment;
        });
    }
}
exports.default = CommentService;
