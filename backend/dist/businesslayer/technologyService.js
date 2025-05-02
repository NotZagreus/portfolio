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
const technologyRepository_1 = __importDefault(require("../datalayer/technologyRepository"));
class TechnologyService {
    static getTechnologies() {
        return __awaiter(this, void 0, void 0, function* () {
            return technologyRepository_1.default.getAllTechnologies();
        });
    }
    static getTechnologyById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const technology = yield technologyRepository_1.default.getTechnologyById(id);
            if (!technology) {
                throw new Error("Technology not found");
            }
            return technology;
        });
    }
    static createTechnology(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.name || !data.image) {
                throw new Error("Title and description are required");
            }
            return technologyRepository_1.default.addTechnology(data);
        });
    }
    static updateTechnology(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const technology = yield technologyRepository_1.default.updateTechnology(id, data);
            if (!technology) {
                throw new Error("Technology not found");
            }
            return technology;
        });
    }
    static deleteTechnology(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const technology = yield technologyRepository_1.default.deleteTechnology(id);
            if (!technology) {
                throw new Error("Technology not found");
            }
            return technology;
        });
    }
}
exports.default = TechnologyService;
