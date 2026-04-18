"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllScholarships = getAllScholarships;
exports.getScholarshipById = getScholarshipById;
exports.searchScholarships = searchScholarships;
exports.createScholarship = createScholarship;
exports.updateScholarship = updateScholarship;
exports.deleteScholarship = deleteScholarship;
const database_1 = __importDefault(require("../config/database"));
// Get all scholarships
async function getAllScholarships(req, res) {
    try {
        const connection = await database_1.default.getConnection();
        const [scholarships] = await connection.query('SELECT * FROM scholarship');
        connection.release();
        res.json({
            success: true,
            data: scholarships
        });
    }
    catch (error) {
        console.error('Error fetching scholarships:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching scholarships',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
// Get scholarship by ID
async function getScholarshipById(req, res) {
    try {
        const { id } = req.params;
        const connection = await database_1.default.getConnection();
        const [scholarships] = await connection.query('SELECT * FROM scholarship WHERE ScholarshipID = ?', [id]);
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
    }
    catch (error) {
        console.error('Error fetching scholarship:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching scholarship',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
// Search scholarships with filters
async function searchScholarships(req, res) {
    try {
        const { search, types, minGPA, maxGPA, courses } = req.query;
        const connection = await database_1.default.getConnection();
        let query = 'SELECT * FROM scholarship WHERE 1=1';
        const params = [];
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
        if (minGPA) {
            query += ` AND GPARequirement >= ?`;
            params.push(parseFloat(minGPA));
        }
        if (maxGPA) {
            query += ` AND GPARequirement <= ?`;
            params.push(parseFloat(maxGPA));
        }
        const [scholarships] = await connection.query(query, params);
        connection.release();
        res.json({
            success: true,
            data: scholarships
        });
    }
    catch (error) {
        console.error('Error searching scholarships:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching scholarships',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
// Create scholarship (Admin only)
async function createScholarship(req, res) {
    try {
        const { ScholarshipName, Provider, Type, Description, Benefits, Amount, Slots, GPARequirement, Deadline, ApplicationMethod, GoogleFormLink, ProviderContact, EligibilityRequirements, ApplicationProcess } = req.body;
        const connection = await database_1.default.getConnection();
        const query = `
      INSERT INTO scholarship (
        ScholarshipName, Provider, Type, Description, Benefits,
        Amount, Slots, GPARequirement, Deadline, ApplicationMethod,
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
            GPARequirement,
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
    }
    catch (error) {
        console.error('Error creating scholarship:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating scholarship',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
// Update scholarship (Admin only)
async function updateScholarship(req, res) {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const connection = await database_1.default.getConnection();
        const updates = [];
        const values = [];
        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined) {
                if (key === 'Benefits' || key === 'EligibilityRequirements' || key === 'ApplicationProcess') {
                    updates.push(`${key} = ?`);
                    values.push(JSON.stringify(updateData[key]));
                }
                else {
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
    }
    catch (error) {
        console.error('Error updating scholarship:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating scholarship',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
// Delete scholarship (Admin only)
async function deleteScholarship(req, res) {
    try {
        const { id } = req.params;
        const connection = await database_1.default.getConnection();
        await connection.query('DELETE FROM scholarship WHERE ScholarshipID = ?', [id]);
        connection.release();
        res.json({
            success: true,
            message: 'Scholarship deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting scholarship:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting scholarship',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
//# sourceMappingURL=scholarshipController.js.map