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
const projectRepository_1 = __importDefault(require("../datalayer/projectRepository"));
class ProjectService {
    static getProjects() {
        return __awaiter(this, void 0, void 0, function* () {
            return projectRepository_1.default.getAllProjects();
        });
    }
    static getProjectById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield projectRepository_1.default.getProjectById(id);
            if (!project) {
                throw new Error("Project not found");
            }
            return project;
        });
    }
    static createProject(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.title || !data.description) {
                throw new Error("Title and description are required");
            }
            return projectRepository_1.default.addProject(data);
        });
    }
    static updateProject(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield projectRepository_1.default.updateProject(id, data);
            if (!project) {
                throw new Error("Project not found");
            }
            return project;
        });
    }
    static deleteProject(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield projectRepository_1.default.deleteProject(id);
            if (!project) {
                throw new Error("Project not found");
            }
            return project;
        });
    }
}
exports.default = ProjectService;
