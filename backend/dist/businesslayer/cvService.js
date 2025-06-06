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
const cvRepository_1 = __importDefault(require("../datalayer/cvRepository"));
class CVService {
    static getCVs() {
        return __awaiter(this, void 0, void 0, function* () {
            return cvRepository_1.default.getAllCVs();
        });
    }
    static getCVById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return cvRepository_1.default.getCVById(id);
        });
    }
    static updateCV(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const CV = yield cvRepository_1.default.updateCV(id, data);
            if (!CV) {
                throw new Error("CV not found");
            }
            return CV;
        });
    }
}
exports.default = CVService;
