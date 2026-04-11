import { Request, Response } from 'express';
import pool from '../config/database';

// Get all favorites for a student
export async function getFavoritesByStudent(req: Request, res: Response) {
  try {
    const userId = req.query.userId || req.body.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'UserId is required'
      });
    }

    const connection = await pool.getConnection();
    const [favorites] = await connection.query(
      `SELECT f.FavoriteID, f.StudentID, f.ScholarshipID, s.* 
       FROM favorite f
       JOIN scholarship s ON f.ScholarshipID = s.ScholarshipID
       WHERE f.StudentID = ?
       ORDER BY f.CreatedAt DESC`,
      [userId]
    );
    connection.release();

    res.json({
      success: true,
      data: favorites
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching favorites',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Check if a scholarship is favorited by a student
export async function checkIsFavorited(req: Request, res: Response) {
  try {
    const { userId, scholarshipId } = req.query;

    if (!userId || !scholarshipId) {
      return res.status(400).json({
        success: false,
        message: 'UserId and ScholarshipId are required'
      });
    }

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'SELECT FavoriteID FROM favorite WHERE StudentID = ? AND ScholarshipID = ?',
      [userId, scholarshipId]
    );
    connection.release();

    res.json({
      success: true,
      isFavorited: Array.isArray(result) && result.length > 0
    });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking favorite status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Add a favorite
export async function addFavorite(req: Request, res: Response) {
  try {
    const { userId, scholarshipId } = req.body;

    if (!userId || !scholarshipId) {
      return res.status(400).json({
        success: false,
        message: 'UserId and ScholarshipId are required'
      });
    }

    const connection = await pool.getConnection();

    // Check if already favorited
    const [existing] = await connection.query(
      'SELECT FavoriteID FROM favorite WHERE StudentID = ? AND ScholarshipID = ?',
      [userId, scholarshipId]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      connection.release();
      return res.status(400).json({
        success: false,
        message: 'This scholarship is already in your favorites'
      });
    }

    // Add favorite
    const [result] = await connection.query(
      'INSERT INTO favorite (StudentID, ScholarshipID) VALUES (?, ?)',
      [userId, scholarshipId]
    );

    connection.release();

    res.json({
      success: true,
      message: 'Scholarship added to favorites',
      data: result
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding favorite',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Remove a favorite
export async function removeFavorite(req: Request, res: Response) {
  try {
    const { userId, scholarshipId } = req.body;

    if (!userId || !scholarshipId) {
      return res.status(400).json({
        success: false,
        message: 'UserId and ScholarshipId are required'
      });
    }

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'DELETE FROM favorite WHERE StudentID = ? AND ScholarshipID = ?',
      [userId, scholarshipId]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }

    res.json({
      success: true,
      message: 'Scholarship removed from favorites'
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing favorite',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
