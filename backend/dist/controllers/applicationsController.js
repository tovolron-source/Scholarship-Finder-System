"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApplicationsByStudent = getApplicationsByStudent;
exports.checkApplicationExists = checkApplicationExists;
exports.createApplication = createApplication;
exports.getApplicationsByScholarship = getApplicationsByScholarship;
exports.updateApplicationStatus = updateApplicationStatus;
exports.getApplicationById = getApplicationById;
exports.approveApplication = approveApplication;
exports.rejectApplication = rejectApplication;
const database_1 = __importDefault(require("../config/database"));
// Get all applications for a student
async function getApplicationsByStudent(req, res) {
    try {
        const studentId = req.params.studentId;
        if (!studentId) {
            res.status(400).json({
                success: false,
                message: 'Student ID is required'
            });
            return;
        }
        const connection = await database_1.default.getConnection();
        const [applications] = await connection.query(`SELECT 
        a.ApplicationID, 
        a.StudentID, 
        a.ScholarshipID, 
        a.Status, 
        a.DateApplied,
        s.ScholarshipName,
        s.Provider,
        s.Amount,
        s.Deadline
      FROM application a 
      JOIN scholarship s ON a.ScholarshipID = s.ScholarshipID 
      WHERE a.StudentID = ? 
      ORDER BY a.DateApplied DESC`, [studentId]);
        connection.release();
        res.json({
            success: true,
            data: applications
        });
    }
    catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
// Check if student already applied to a scholarship
async function checkApplicationExists(req, res) {
    try {
        const { studentId, scholarshipId } = req.params;
        if (!studentId || !scholarshipId) {
            res.status(400).json({
                success: false,
                message: 'Student ID and Scholarship ID are required'
            });
            return;
        }
        const connection = await database_1.default.getConnection();
        const [applications] = await connection.query('SELECT ApplicationID FROM application WHERE StudentID = ? AND ScholarshipID = ?', [studentId, scholarshipId]);
        connection.release();
        const hasApplied = applications.length > 0;
        res.json({
            success: true,
            hasApplied,
            message: hasApplied ? 'Student has already applied' : 'Student has not applied yet'
        });
    }
    catch (error) {
        console.error('Error checking application:', error);
        res.status(500).json({
            success: false,
            message: 'Error checking application',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
// Create new application
async function createApplication(req, res) {
    try {
        const { StudentID, ScholarshipID, PersonalStatement } = req.body;
        const files = req.files;
        if (!StudentID || !ScholarshipID) {
            res.status(400).json({
                success: false,
                message: 'Student ID and Scholarship ID are required'
            });
            return;
        }
        const connection = await database_1.default.getConnection();
        // Check if already applied
        const [existingApp] = await connection.query('SELECT ApplicationID FROM application WHERE StudentID = ? AND ScholarshipID = ?', [StudentID, ScholarshipID]);
        if (existingApp.length > 0) {
            connection.release();
            res.status(409).json({
                success: false,
                message: 'Student has already applied to this scholarship'
            });
            return;
        }
        // Extract file paths from uploaded files
        const transcriptPath = files?.transcript?.[0]?.path || null;
        const idDocumentPath = files?.idDocument?.[0]?.path || null;
        const recommendationPath = files?.recommendation?.[0]?.path || null;
        console.log('📝 Creating application with files:', {
            transcriptPath,
            idDocumentPath,
            recommendationPath
        });
        // Create application with file paths
        const [result] = await connection.query(`INSERT INTO application (StudentID, ScholarshipID, PersonalStatement, TranscriptPath, IDDocumentPath, RecommendationPath, Status) 
       VALUES (?, ?, ?, ?, ?, ?, 'Pending')`, [StudentID, ScholarshipID, PersonalStatement || null, transcriptPath, idDocumentPath, recommendationPath]);
        connection.release();
        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            applicationId: result.insertId
        });
    }
    catch (error) {
        console.error('❌ Error creating application:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting application',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
// Get applications for a specific scholarship (admin)
async function getApplicationsByScholarship(req, res) {
    try {
        const scholarshipId = req.params.scholarshipId || req.params.id;
        if (!scholarshipId) {
            res.status(400).json({
                success: false,
                message: 'Scholarship ID is required'
            });
            return;
        }
        const connection = await database_1.default.getConnection();
        const [applications] = await connection.query(`SELECT 
        a.ApplicationID,
        a.StudentID as UserID,
        a.ScholarshipID,
        a.Status,
        a.DateApplied as AppliedDate,
        sp.fullName,
        u.Email,
        sp.address as Address,
        sp.contactNumber as PhoneNumber
      FROM application a 
      JOIN user u ON a.StudentID = u.id 
      LEFT JOIN student_profile sp ON u.id = sp.userId
      WHERE a.ScholarshipID = ? 
      ORDER BY a.DateApplied DESC`, [scholarshipId]);
        connection.release();
        // Transform fullName into FirstName and LastName
        const transformedApplications = applications.map(app => {
            const nameParts = app.fullName ? app.fullName.split(' ') : ['', ''];
            return {
                ...app,
                FirstName: nameParts[0] || '',
                LastName: nameParts.slice(1).join(' ') || ''
            };
        });
        res.json({
            success: true,
            data: transformedApplications,
            count: transformedApplications.length
        });
    }
    catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
// Update application status (admin)
async function updateApplicationStatus(req, res) {
    try {
        const { applicationId } = req.params;
        const { Status } = req.body;
        if (!applicationId || !Status) {
            res.status(400).json({
                success: false,
                message: 'Application ID and Status are required'
            });
            return;
        }
        const validStatuses = ['Pending', 'Under Review', 'Approved', 'Rejected'];
        if (!validStatuses.includes(Status)) {
            res.status(400).json({
                success: false,
                message: 'Invalid status. Must be one of: Pending, Under Review, Approved, Rejected'
            });
            return;
        }
        const connection = await database_1.default.getConnection();
        await connection.query('UPDATE application SET Status = ?, LastUpdated = CURRENT_TIMESTAMP WHERE ApplicationID = ?', [Status, applicationId]);
        connection.release();
        res.json({
            success: true,
            message: 'Application status updated successfully'
        });
    }
    catch (error) {
        console.error('Error updating application:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating application',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
// Get application by ID
async function getApplicationById(req, res) {
    try {
        const { applicationId } = req.params;
        if (!applicationId) {
            res.status(400).json({
                success: false,
                message: 'Application ID is required'
            });
            return;
        }
        const connection = await database_1.default.getConnection();
        const [applications] = await connection.query(`SELECT * FROM application WHERE ApplicationID = ?`, [applicationId]);
        connection.release();
        if (applications.length === 0) {
            res.status(404).json({
                success: false,
                message: 'Application not found'
            });
            return;
        }
        res.json({
            success: true,
            data: applications[0]
        });
    }
    catch (error) {
        console.error('Error fetching application:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching application',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
// Approve application (admin)
async function approveApplication(req, res) {
    try {
        const { applicationId } = req.params;
        if (!applicationId) {
            res.status(400).json({
                success: false,
                message: 'Application ID is required'
            });
            return;
        }
        const connection = await database_1.default.getConnection();
        await connection.query('UPDATE application SET Status = ?, LastUpdated = CURRENT_TIMESTAMP WHERE ApplicationID = ?', ['Approved', applicationId]);
        connection.release();
        res.json({
            success: true,
            message: 'Application approved successfully'
        });
    }
    catch (error) {
        console.error('Error approving application:', error);
        res.status(500).json({
            success: false,
            message: 'Error approving application',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
// Reject application (admin)
async function rejectApplication(req, res) {
    try {
        const { applicationId } = req.params;
        if (!applicationId) {
            res.status(400).json({
                success: false,
                message: 'Application ID is required'
            });
            return;
        }
        const connection = await database_1.default.getConnection();
        await connection.query('UPDATE application SET Status = ?, LastUpdated = CURRENT_TIMESTAMP WHERE ApplicationID = ?', ['Rejected', applicationId]);
        connection.release();
        res.json({
            success: true,
            message: 'Application rejected successfully'
        });
    }
    catch (error) {
        console.error('Error rejecting application:', error);
        res.status(500).json({
            success: false,
            message: 'Error rejecting application',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
//# sourceMappingURL=applicationsController.js.map