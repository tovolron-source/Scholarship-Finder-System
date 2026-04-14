import { Request, Response } from 'express';
import pool from '../config/database';

// Get all favorites for a student
export async function getFavoritesByStudent(req: Request, res: Response) {
  let connection;
  try {
    const userIdParam = req.query.userId || req.body.userId;

    if (!userIdParam) {
      return res.status(400).json({
        success: false,
        message: 'UserId is required'
      });
    }

    // Convert to number if it's a string
    const userId = parseInt(String(userIdParam), 10);

    // Validate that conversion was successful
    if (!Number.isFinite(userId)) {
      return res.status(400).json({
        success: false,
        message: 'UserId must be a valid number'
      });
    }

    connection = await pool.getConnection();
    const [favorites] = await connection.query(
      `SELECT f.FavoriteID, f.StudentID, f.ScholarshipID, 
              s.ScholarshipID, s.ScholarshipName, s.Provider, s.Type, 
              s.Description, s.Benefits, s.Amount, s.Slots, 
              s.GPARequirement, s.Deadline, s.ApplicationMethod,
              s.GoogleFormLink, s.ProviderContact, s.EligibilityRequirements, 
              s.ApplicationProcess
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
    if (connection) connection.release();
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
  let connection;
  try {
    const { userId: userIdParam, scholarshipId: scholarshipIdParam } = req.query;

    if (!userIdParam || !scholarshipIdParam) {
      return res.status(400).json({
        success: false,
        message: 'UserId and ScholarshipId are required'
      });
    }

    // Convert to numbers if they're strings
    const userId = parseInt(String(userIdParam), 10);
    const scholarshipId = parseInt(String(scholarshipIdParam), 10);

    // Validate that conversion was successful
    if (!Number.isFinite(userId) || !Number.isFinite(scholarshipId)) {
      return res.status(400).json({
        success: false,
        message: 'UserId and ScholarshipId must be valid numbers'
      });
    }

    connection = await pool.getConnection();
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
    if (connection) connection.release();
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
  let connection;
  try {
    const { userId: userIdParam, scholarshipId: scholarshipIdParam } = req.body;

    if (!userIdParam || !scholarshipIdParam) {
      return res.status(400).json({
        success: false,
        message: 'UserId and ScholarshipId are required'
      });
    }

    // Convert to numbers
    const userId = parseInt(String(userIdParam), 10);
    const scholarshipId = parseInt(String(scholarshipIdParam), 10);

    // Validate that conversion was successful
    if (!Number.isFinite(userId) || !Number.isFinite(scholarshipId)) {
      return res.status(400).json({
        success: false,
        message: 'UserId and ScholarshipId must be valid numbers'
      });
    }

    connection = await pool.getConnection();

    // Check if already favorited
    const [existing] = await connection.query(
      'SELECT FavoriteID FROM favorite WHERE StudentID = ? AND ScholarshipID = ?',
      [userId, scholarshipId]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      connection.release();
      return res.status(409).json({
        success: false,
        message: 'This scholarship is already in your favorites'
      });
    }

    // Add favorite
    await connection.query(
      'INSERT INTO favorite (StudentID, ScholarshipID) VALUES (?, ?)',
      [userId, scholarshipId]
    );

    connection.release();

    res.status(201).json({
      success: true,
      message: 'Scholarship added to favorites'
    });
  } catch (error) {
    if (connection) connection.release();
    console.error('Error adding favorite:', error);
    
    // Check for duplicate entry error from database
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage.includes('Duplicate entry')) {
      return res.status(409).json({
        success: false,
        message: 'This scholarship is already in your favorites'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error adding favorite',
      error: errorMessage
    });
  }
}

// Remove a favorite
export async function removeFavorite(req: Request, res: Response) {
  let connection;
  try {
    const { userId: userIdParam, scholarshipId: scholarshipIdParam } = req.body;

    if (!userIdParam || !scholarshipIdParam) {
      return res.status(400).json({
        success: false,
        message: 'UserId and ScholarshipId are required'
      });
    }

    // Convert to numbers
    const userId = parseInt(String(userIdParam), 10);
    const scholarshipId = parseInt(String(scholarshipIdParam), 10);

    // Validate that conversion was successful
    if (!Number.isFinite(userId) || !Number.isFinite(scholarshipId)) {
      return res.status(400).json({
        success: false,
        message: 'UserId and ScholarshipId must be valid numbers'
      });
    }

    connection = await pool.getConnection();
    const [result] = await connection.query(
      'DELETE FROM favorite WHERE StudentID = ? AND ScholarshipID = ?',
      [userId, scholarshipId]
    );
    connection.release();

    if ((result as any).affectedRows === 0) {
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
    if (connection) connection.release();
    console.error('Error removing favorite:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing favorite',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
