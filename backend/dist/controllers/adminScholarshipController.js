"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScholarship = createScholarship;
exports.updateScholarship = updateScholarship;
exports.deleteScholarship = deleteScholarship;
const database_1 = __importDefault(require("../config/database"));
// Admin: Create new scholarship
async function createScholarship(req, res) {
    try {
        const { ScholarshipName, Provider, Type, Description, Benefits, Amount, Slots, GPARequirement, Deadline, ApplicationMethod, GoogleFormLink, ProviderContact, EligibilityRequirements, ApplicationProcess } = req.body;
        // Validate required fields
        if (!ScholarshipName || !Provider || !Type) {
            return res.status(400).json({
                success: false,
                message: 'ScholarshipName, Provider, and Type are required'
            });
        }
        const connection = await database_1.default.getConnection();
        const [result] = await connection.query(`INSERT INTO scholarship (ScholarshipName, Provider, Type, Description, Benefits, Amount, Slots, GPARequirement, Deadline, ApplicationMethod, GoogleFormLink, ProviderContact, EligibilityRequirements, ApplicationProcess)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            ScholarshipName,
            Provider,
            Type,
            Description || null,
            typeof Benefits === 'string' ? Benefits : JSON.stringify(Benefits || []),
            Amount || null,
            Slots || 0,
            GPARequirement || null,
            Deadline || null,
            ApplicationMethod || null,
            GoogleFormLink || null,
            ProviderContact || null,
            typeof EligibilityRequirements === 'string' ? EligibilityRequirements : JSON.stringify(EligibilityRequirements || {}),
            typeof ApplicationProcess === 'string' ? ApplicationProcess : JSON.stringify(ApplicationProcess || [])
        ]);
        connection.release();
        res.status(201).json({
            success: true,
            message: 'Scholarship created successfully',
            data: {
                ScholarshipID: result.insertId,
                ScholarshipName,
                Provider,
                Type
            }
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
// Admin: Update scholarship
async function updateScholarship(req, res) {
    try {
        const { id } = req.params;
        const { ScholarshipName, Provider, Type, Description, Benefits, Amount, Slots, GPARequirement, Deadline, ApplicationMethod, GoogleFormLink, ProviderContact, EligibilityRequirements, ApplicationProcess } = req.body;
        const connection = await database_1.default.getConnection();
        // Check if scholarship exists
        const [existing] = await connection.query('SELECT * FROM scholarship WHERE ScholarshipID = ?', [id]);
        if (Array.isArray(existing) && existing.length === 0) {
            connection.release();
            return res.status(404).json({
                success: false,
                message: 'Scholarship not found'
            });
        }
        const currentScholarship = existing[0];
        // Update fields
        const updateFields = [];
        const updateValues = [];
        if (ScholarshipName !== undefined) {
            updateFields.push('ScholarshipName = ?');
            updateValues.push(ScholarshipName);
        }
        if (Provider !== undefined) {
            updateFields.push('Provider = ?');
            updateValues.push(Provider);
        }
        if (Type !== undefined) {
            updateFields.push('Type = ?');
            updateValues.push(Type);
        }
        if (Description !== undefined) {
            updateFields.push('Description = ?');
            updateValues.push(Description);
        }
        if (Benefits !== undefined) {
            updateFields.push('Benefits = ?');
            updateValues.push(typeof Benefits === 'string' ? Benefits : JSON.stringify(Benefits));
        }
        if (Amount !== undefined) {
            updateFields.push('Amount = ?');
            updateValues.push(Amount);
        }
        if (Slots !== undefined) {
            updateFields.push('Slots = ?');
            updateValues.push(Slots);
        }
        if (GPARequirement !== undefined) {
            updateFields.push('GPARequirement = ?');
            updateValues.push(GPARequirement);
        }
        if (Deadline !== undefined) {
            updateFields.push('Deadline = ?');
            updateValues.push(Deadline);
        }
        if (ApplicationMethod !== undefined) {
            updateFields.push('ApplicationMethod = ?');
            updateValues.push(ApplicationMethod);
        }
        if (GoogleFormLink !== undefined) {
            updateFields.push('GoogleFormLink = ?');
            updateValues.push(GoogleFormLink);
        }
        if (ProviderContact !== undefined) {
            updateFields.push('ProviderContact = ?');
            updateValues.push(ProviderContact);
        }
        if (EligibilityRequirements !== undefined) {
            updateFields.push('EligibilityRequirements = ?');
            updateValues.push(typeof EligibilityRequirements === 'string' ? EligibilityRequirements : JSON.stringify(EligibilityRequirements));
        }
        if (ApplicationProcess !== undefined) {
            updateFields.push('ApplicationProcess = ?');
            updateValues.push(typeof ApplicationProcess === 'string' ? ApplicationProcess : JSON.stringify(ApplicationProcess));
        }
        if (updateFields.length === 0) {
            connection.release();
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }
        updateValues.push(id);
        await connection.query(`UPDATE scholarship SET ${updateFields.join(', ')} WHERE ScholarshipID = ?`, updateValues);
        // Fetch updated scholarship
        const [updated] = await connection.query('SELECT * FROM scholarship WHERE ScholarshipID = ?', [id]);
        connection.release();
        res.json({
            success: true,
            message: 'Scholarship updated successfully',
            data: Array.isArray(updated) ? updated[0] : null
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
// Admin: Delete scholarship
async function deleteScholarship(req, res) {
    try {
        const { id } = req.params;
        const connection = await database_1.default.getConnection();
        // Check if scholarship exists
        const [existing] = await connection.query('SELECT * FROM scholarship WHERE ScholarshipID = ?', [id]);
        if (Array.isArray(existing) && existing.length === 0) {
            connection.release();
            return res.status(404).json({
                success: false,
                message: 'Scholarship not found'
            });
        }
        // Delete scholarship
        await connection.query('DELETE FROM scholarship WHERE ScholarshipID = ?', [id]);
        // Also delete related favorites
        await connection.query('DELETE FROM favorites WHERE ScholarshipID = ?', [id]);
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
//# sourceMappingURL=adminScholarshipController.js.map