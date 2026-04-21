"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const applicationsController_1 = require("../controllers/applicationsController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Student routes
router.get('/student/:studentId', auth_1.verifyToken, applicationsController_1.getApplicationsByStudent);
router.get('/check/:studentId/:scholarshipId', applicationsController_1.checkApplicationExists);
router.post('/', auth_1.verifyToken, applicationsController_1.createApplication);
router.get('/:applicationId', applicationsController_1.getApplicationById);
// Admin routes
router.get('/scholarship/:scholarshipId', applicationsController_1.getApplicationsByScholarship);
router.put('/:applicationId/status', applicationsController_1.updateApplicationStatus);
exports.default = router;
//# sourceMappingURL=applications.js.map