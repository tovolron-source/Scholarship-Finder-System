"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdminToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const verifyAdminToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'No token provided'
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (decoded.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
            return;
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};
exports.verifyAdminToken = verifyAdminToken;
//# sourceMappingURL=adminAuth.js.map