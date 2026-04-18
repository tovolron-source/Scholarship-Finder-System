import express from 'express';
import { verifyAdminToken } from '../middleware/adminAuth';
import { createScholarship, updateScholarship, deleteScholarship } from '../controllers/adminScholarshipController';
import { changeEmail, changePassword } from '../controllers/authController';

const router = express.Router();

// Admin Scholarship Management
router.post('/scholarships', verifyAdminToken, createScholarship);
router.put('/scholarships/:id', verifyAdminToken, updateScholarship);
router.delete('/scholarships/:id', verifyAdminToken, deleteScholarship);

// Account Settings (accessible to admins and students)
router.put('/change-email/:id', changeEmail);
router.put('/change-password/:id', changePassword);

export default router;
