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
const technology_1 = __importDefault(require("./technology"));
class TechnologyRepository {
    static getAllTechnologies() {
        return __awaiter(this, void 0, void 0, function* () {
            return technology_1.default.find();
        });
    }
    static getTechnologyById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return technology_1.default.findById(id);
        });
    }
    static addTechnology(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = new technology_1.default(data);
            return project.save();
        });
    }
    static updateTechnology(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return technology_1.default.findByIdAndUpdate(id, data, { new: true });
        });
    }
    static deleteTechnology(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return technology_1.default.findByIdAndDelete(id);
        });
    }
}
exports.default = TechnologyRepository;
