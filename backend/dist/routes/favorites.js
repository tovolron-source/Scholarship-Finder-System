"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const favoriteController_1 = require("../controllers/favoriteController");
const router = express_1.default.Router();
// Get all favorites for a student
router.get('/student', favoriteController_1.getFavoritesByStudent);
// Check if a scholarship is favorited
router.get('/check', favoriteController_1.checkIsFavorited);
// Add a favorite
router.post('/', favoriteController_1.addFavorite);
// Remove a favorite
router.delete('/', favoriteController_1.removeFavorite);
exports.default = router;
//# sourceMappingURL=favorites.js.map