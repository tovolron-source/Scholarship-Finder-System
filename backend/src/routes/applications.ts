import express from 'express';
import multer from 'multer';
import path from 'path';
import { 
  getApplicationsByStudent, 
  checkApplicationExists,
  createApplication, 
  getApplicationsByScholarship,
  updateApplicationStatus,
  getApplicationById,
  approveApplication,
  rejectApplication
} from '../controllers/applicationsController';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Student routes
router.get('/student/:studentId', verifyToken, getApplicationsByStudent);
router.get('/check/:studentId/:scholarshipId', checkApplicationExists);
router.post('/', verifyToken, upload.fields([
  { name: 'transcript', maxCount: 1 },
  { name: 'idDocument', maxCount: 1 },
  { name: 'recommendation', maxCount: 1 }
]), createApplication);
router.get('/:applicationId', getApplicationById);

// Admin routes
router.get('/scholarship/:scholarshipId', getApplicationsByScholarship);
router.put('/:applicationId/status', updateApplicationStatus);
router.put('/:applicationId/approve', approveApplication);
router.put('/:applicationId/reject', rejectApplication);

export default router;
