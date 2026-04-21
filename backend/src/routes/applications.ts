import express from 'express';
import { 
  getApplicationsByStudent, 
  checkApplicationExists,
  createApplication, 
  getApplicationsByScholarship,
  updateApplicationStatus,
  getApplicationById 
} from '../controllers/applicationsController';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

// Student routes
router.get('/student/:studentId', verifyToken, getApplicationsByStudent);
router.get('/check/:studentId/:scholarshipId', checkApplicationExists);
router.post('/', verifyToken, createApplication);
router.get('/:applicationId', getApplicationById);

// Admin routes
router.get('/scholarship/:scholarshipId', getApplicationsByScholarship);
router.put('/:applicationId/status', updateApplicationStatus);

export default router;
