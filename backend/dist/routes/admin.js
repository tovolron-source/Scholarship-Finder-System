"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminAuth_1 = require("../middleware/adminAuth");
const adminScholarshipController_1 = require("../controllers/adminScholarshipController");
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
// Admin Scholarship Management
router.post('/scholarships', adminAuth_1.verifyAdminToken, adminScholarshipController_1.createScholarship);
router.put('/scholarships/:id', adminAuth_1.verifyAdminToken, adminScholarshipController_1.updateScholarship);
router.delete('/scholarships/:id', adminAuth_1.verifyAdminToken, adminScholarshipController_1.deleteScholarship);
// Account Settings (accessible to admins and students)
router.put('/change-email/:id', authController_1.changeEmail);
router.put('/change-password/:id', authController_1.changePassword);
exports.default = router;
//# sourceMappingURL=admin.js.map