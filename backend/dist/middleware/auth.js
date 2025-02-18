"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermissions = exports.checkJwt = void 0;
const express_oauth2_jwt_bearer_1 = require("express-oauth2-jwt-bearer");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const checkJwt = (0, express_oauth2_jwt_bearer_1.auth)({
    audience: "https://artemk-portfolio.com",
    issuerBaseURL: "https://dev-k4fhctws467co87d.us.auth0.com/",
    tokenSigningAlg: "RS256",
});
exports.checkJwt = checkJwt;
const checkPermissions = () => {
    return (req, res, next) => {
        var _a;
        const auth = req.auth;
        const permissions = ((_a = auth === null || auth === void 0 ? void 0 : auth.payload) === null || _a === void 0 ? void 0 : _a.permissions) || [];
        if (!permissions.includes("manage:portfolio")) {
            res.status(403).json({
                message: `Forbidden: You don't have access to manage the portfolio.`,
            });
            return;
        }
        next();
    };
};
exports.checkPermissions = checkPermissions;
