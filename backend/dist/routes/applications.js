"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const applicationsController_1 = require("../controllers/applicationsController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type'));
        }
    }
});
// Student routes
router.get('/student/:studentId', auth_1.verifyToken, applicationsController_1.getApplicationsByStudent);
router.get('/check/:studentId/:scholarshipId', applicationsController_1.checkApplicationExists);
router.post('/', auth_1.verifyToken, upload.fields([
    { name: 'transcript', maxCount: 1 },
    { name: 'idDocument', maxCount: 1 },
    { name: 'recommendation', maxCount: 1 }
]), applicationsController_1.createApplication);
router.get('/:applicationId', applicationsController_1.getApplicationById);
// Admin routes
router.get('/scholarship/:scholarshipId', applicationsController_1.getApplicationsByScholarship);
router.put('/:applicationId/status', applicationsController_1.updateApplicationStatus);
router.put('/:applicationId/approve', applicationsController_1.approveApplication);
router.put('/:applicationId/reject', applicationsController_1.rejectApplication);
exports.default = router;
//# sourceMappingURL=applications.js.map