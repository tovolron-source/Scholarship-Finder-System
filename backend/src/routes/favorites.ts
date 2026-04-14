import express from 'express';
import {
  getFavoritesByStudent,
  checkIsFavorited,
  addFavorite,
  removeFavorite
} from '../controllers/favoriteController';

const router = express.Router();

// Get all favorites for a student
router.get('/student', getFavoritesByStudent);

// Check if a scholarship is favorited
router.get('/check', checkIsFavorited);

// Add a favorite
router.post('/', addFavorite);

// Remove a favorite
router.delete('/', removeFavorite);

export default router;

