"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const scholarshipController_1 = require("../controllers/scholarshipController");
const router = express_1.default.Router();
// Public routes
router.get('/', scholarshipController_1.getAllScholarships);
router.get('/search', scholarshipController_1.searchScholarships);
router.get('/:id', scholarshipController_1.getScholarshipById);
// Admin routes (you can add authentication middleware here later)
router.post('/', scholarshipController_1.createScholarship);
router.put('/:id', scholarshipController_1.updateScholarship);
router.delete('/:id', scholarshipController_1.deleteScholarship);
exports.default = router;
//# sourceMappingURL=scholarships.js.map