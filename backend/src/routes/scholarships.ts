import express from 'express';
import { 
  getAllScholarships, 
  getScholarshipById, 
  searchScholarships, 
  createScholarship, 
  updateScholarship, 
  deleteScholarship 
} from '../controllers/scholarshipController';

const router = express.Router();

// Public routes
router.get('/', getAllScholarships);
router.get('/search', searchScholarships);
router.get('/:id', getScholarshipById);

// Admin routes (you can add authentication middleware here later)
router.post('/', createScholarship);
router.put('/:id', updateScholarship);
router.delete('/:id', deleteScholarship);

export default router;
