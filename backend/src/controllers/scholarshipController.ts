import { Request, Response } from 'express';
import pool from '../config/database';

// Get all scholarships
export async function getAllScholarships(req: Request, res: Response) {
  try {
    const connection = await pool.getConnection();
    const [scholarships] = await connection.query('SELECT * FROM scholarship');
    connection.release();

    res.json({
      success: true,
      data: scholarships
    });
  } catch (error) {
    console.error('Error fetching scholarships:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching scholarships',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Get scholarship by ID
export async function getScholarshipById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [scholarships] = await connection.query(
      'SELECT * FROM scholarship WHERE ScholarshipID = ?',
      [id]
    );
    connection.release();

    if (Array.isArray(scholarships) && scholarships.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Scholarship not found'
      });
    }

    res.json({
      success: true,
      data: Array.isArray(scholarships) ? scholarships[0] : null
    });
  } catch (error) {
    console.error('Error fetching scholarship:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching scholarship',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Search scholarships with filters
export async function searchScholarships(req: Request, res: Response) {
  try {
    const { search, types, minGWA, maxGWA, courses } = req.query;
    const connection = await pool.getConnection();

    let query = 'SELECT * FROM scholarship WHERE 1=1';
    const params: any[] = [];

    if (search) {
      query += ` AND (ScholarshipName LIKE ? OR Provider LIKE ? OR Description LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (types) {
      const typeArray = Array.isArray(types) ? types : [types];
      query += ` AND Type IN (${typeArray.map(() => '?').join(',')})`;
      params.push(...typeArray);
    }

    if (minGWA) {
      query += ` AND GWARequirement >= ?`;
      params.push(parseFloat(minGWA as string));
    }

    if (maxGWA) {
      query += ` AND GWARequirement <= ?`;
      params.push(parseFloat(maxGWA as string));
    }

    const [scholarships] = await connection.query(query, params);
    connection.release();

    res.json({
      success: true,
      data: scholarships
    });
  } catch (error) {
    console.error('Error searching scholarships:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching scholarships',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Create scholarship (Admin only)
export async function createScholarship(req: Request, res: Response) {
  try {
    const {
      ScholarshipName,
      Provider,
      Type,
      Description,
      Benefits,
      Amount,
      Slots,
      GWARequirement,
      Deadline,
      ApplicationMethod,
      GoogleFormLink,
      ProviderContact,
      EligibilityRequirements,
      ApplicationProcess
    } = req.body;

    // Validate GWA (1.0-5.0 range)
    if (EligibilityRequirements?.gwa) {
      const gwaValue = parseFloat(EligibilityRequirements.gwa);
      if (isNaN(gwaValue) || gwaValue < 1.0 || gwaValue > 5.0) {
        return res.status(400).json({
          success: false,
          message: 'GWA must be between 1.0 (best) and 5.0 (worst)'
        });
      }
    }

    // Validate Slots
    if (Slots && (isNaN(Number(Slots)) || Number(Slots) <= 0)) {
      return res.status(400).json({
        success: false,
        message: 'Available Slots must be greater than 0'
      });
    }

    const connection = await pool.getConnection();
    const query = `
      INSERT INTO scholarship (
        ScholarshipName, Provider, Type, Description, Benefits,
        Amount, Slots, GWARequirement, Deadline, ApplicationMethod,
        GoogleFormLink, ProviderContact, EligibilityRequirements, ApplicationProcess
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await connection.query(query, [
      ScholarshipName,
      Provider,
      Type,
      Description,
      JSON.stringify(Benefits),
      Amount,
      Slots,
      GWARequirement,
      Deadline,
      ApplicationMethod,
      GoogleFormLink,
      ProviderContact,
      JSON.stringify(EligibilityRequirements),
      JSON.stringify(ApplicationProcess)
    ]);

    connection.release();

    res.json({
      success: true,
      message: 'Scholarship created successfully',
      data: result
    });
  } catch (error) {
    console.error('Error creating scholarship:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating scholarship',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Update scholarship (Admin only)
export async function updateScholarship(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate GWA (1.0-5.0 range)
    if (updateData.EligibilityRequirements?.gwa) {
      const gwaValue = parseFloat(updateData.EligibilityRequirements.gwa);
      if (isNaN(gwaValue) || gwaValue < 1.0 || gwaValue > 5.0) {
        return res.status(400).json({
          success: false,
          message: 'GWA must be between 1.0 (best) and 5.0 (worst)'
        });
      }
    }

    // Validate Slots
    if (updateData.Slots && (isNaN(Number(updateData.Slots)) || Number(updateData.Slots) <= 0)) {
      return res.status(400).json({
        success: false,
        message: 'Available Slots must be greater than 0'
      });
    }

    const connection = await pool.getConnection();
    const updates: string[] = [];
    const values: any[] = [];

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        if (key === 'Benefits' || key === 'EligibilityRequirements' || key === 'ApplicationProcess') {
          updates.push(`${key} = ?`);
          values.push(JSON.stringify(updateData[key]));
        } else {
          updates.push(`${key} = ?`);
          values.push(updateData[key]);
        }
      }
    });

    values.push(id);

    const query = `UPDATE scholarship SET ${updates.join(', ')} WHERE ScholarshipID = ?`;
    await connection.query(query, values);
    connection.release();

    res.json({
      success: true,
      message: 'Scholarship updated successfully'
    });
  } catch (error) {
    console.error('Error updating scholarship:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating scholarship',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Delete scholarship (Admin only)
export async function deleteScholarship(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM scholarship WHERE ScholarshipID = ?', [id]);
    connection.release();

    res.json({
      success: true,
      message: 'Scholarship deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting scholarship:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting scholarship',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
