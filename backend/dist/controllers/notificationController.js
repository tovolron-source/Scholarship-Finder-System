"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotifications = getNotifications;
exports.getUnreadCount = getUnreadCount;
exports.markAsRead = markAsRead;
exports.markAllAsRead = markAllAsRead;
exports.createNotification = createNotification;
exports.deleteNotification = deleteNotification;
exports.generateDeadlineNotifications = generateDeadlineNotifications;
exports.generateStatusNotifications = generateStatusNotifications;
const database_1 = __importDefault(require("../config/database"));
// Get all notifications for a user
async function getNotifications(req, res) {
    try {
        const studentId = req.params.studentId;
        if (!studentId) {
            console.error('❌ No student ID provided');
            res.status(400).json({
                success: false,
                message: 'Student ID is required'
            });
            return;
        }
        console.log(`📬 Fetching notifications for student: ${studentId}`);
        const connection = await database_1.default.getConnection();
        const [notifications] = await connection.query(`SELECT 
        n.NotificationID,
        n.StudentID,
        n.Type,
        n.Title,
        n.Message,
        n.ScholarshipID,
        n.ApplicationID,
        n.IsRead,
        n.CreatedAt,
        s.ScholarshipName,
        a.Status as ApplicationStatus
      FROM notification n
      LEFT JOIN scholarship s ON n.ScholarshipID = s.ScholarshipID
      LEFT JOIN application a ON n.ApplicationID = a.ApplicationID
      WHERE n.StudentID = ?
      ORDER BY n.CreatedAt DESC
      LIMIT 100`, [studentId]);
        connection.release();
        console.log(`✅ Found ${notifications.length} notifications for student ${studentId}`);
        res.json({
            success: true,
            data: notifications,
            count: notifications.length
        });
    }
    catch (error) {
        console.error('❌ Error fetching notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching notifications',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
// Get unread notifications count
async function getUnreadCount(req, res) {
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
        const [result] = await connection.query(`SELECT COUNT(*) as count FROM notification WHERE StudentID = ? AND IsRead = FALSE`, [studentId]);
        connection.release();
        const count = result[0]?.count || 0;
        res.json({
            success: true,
            unreadCount: count
        });
    }
    catch (error) {
        console.error('Error fetching unread count:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching unread count',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
// Mark notification as read
async function markAsRead(req, res) {
    try {
        const { notificationId } = req.params;
        if (!notificationId) {
            res.status(400).json({
                success: false,
                message: 'Notification ID is required'
            });
            return;
        }
        const connection = await database_1.default.getConnection();
        await connection.query('UPDATE notification SET IsRead = TRUE WHERE NotificationID = ?', [notificationId]);
        connection.release();
        res.json({
            success: true,
            message: 'Notification marked as read'
        });
    }
    catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({
            success: false,
            message: 'Error marking notification as read',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
// Mark all notifications as read
async function markAllAsRead(req, res) {
    try {
        const { studentId } = req.body;
        if (!studentId) {
            res.status(400).json({
                success: false,
                message: 'Student ID is required'
            });
            return;
        }
        const connection = await database_1.default.getConnection();
        await connection.query('UPDATE notification SET IsRead = TRUE WHERE StudentID = ?', [studentId]);
        connection.release();
        res.json({
            success: true,
            message: 'All notifications marked as read'
        });
    }
    catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({
            success: false,
            message: 'Error marking all notifications as read',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
// Create notification (internal use)
async function createNotification(req, res) {
    try {
        const { StudentID, Type, Title, Message, ScholarshipID, ApplicationID } = req.body;
        if (!StudentID || !Type || !Title || !Message) {
            res.status(400).json({
                success: false,
                message: 'StudentID, Type, Title, and Message are required'
            });
            return;
        }
        const connection = await database_1.default.getConnection();
        await connection.query(`INSERT INTO notification (StudentID, Type, Title, Message, ScholarshipID, ApplicationID, IsRead)
       VALUES (?, ?, ?, ?, ?, ?, FALSE)`, [StudentID, Type, Title, Message, ScholarshipID || null, ApplicationID || null]);
        connection.release();
        res.status(201).json({
            success: true,
            message: 'Notification created successfully'
        });
    }
    catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating notification',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
// Delete notification
async function deleteNotification(req, res) {
    try {
        const { notificationId } = req.params;
        if (!notificationId) {
            res.status(400).json({
                success: false,
                message: 'Notification ID is required'
            });
            return;
        }
        const connection = await database_1.default.getConnection();
        await connection.query('DELETE FROM notification WHERE NotificationID = ?', [notificationId]);
        connection.release();
        res.json({
            success: true,
            message: 'Notification deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting notification',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
// Generate notifications for approaching deadlines (call this periodically or on demand)
async function generateDeadlineNotifications(req, res) {
    try {
        const connection = await database_1.default.getConnection();
        // Get all applications with scholarships that have deadlines in the next 7 days
        const [applications] = await connection.query(`SELECT 
        a.ApplicationID,
        a.StudentID,
        a.ScholarshipID,
        s.ScholarshipName,
        s.Deadline
      FROM application a
      JOIN scholarship s ON a.ScholarshipID = s.ScholarshipID
      WHERE s.Deadline IS NOT NULL 
      AND s.Deadline > CURDATE() 
      AND s.Deadline <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)
      AND a.Status = 'Pending'`);
        let notificationsCreated = 0;
        // Create notifications for each application
        for (const app of applications) {
            const daysUntilDeadline = Math.ceil((new Date(app.Deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            // Check if notification already exists for this deadline
            const [existing] = await connection.query(`SELECT NotificationID FROM notification 
         WHERE StudentID = ? AND ScholarshipID = ? AND Type = 'deadline' 
         AND DATE(CreatedAt) = CURDATE()`, [app.StudentID, app.ScholarshipID]);
            if (existing.length === 0) {
                await connection.query(`INSERT INTO notification (StudentID, Type, Title, Message, ScholarshipID, IsRead)
           VALUES (?, 'deadline', 'Deadline Approaching', ?, ?, FALSE)`, [
                    app.StudentID,
                    `${app.ScholarshipName} deadline is ${daysUntilDeadline} day${daysUntilDeadline !== 1 ? 's' : ''} away`,
                    app.ScholarshipID
                ]);
                notificationsCreated++;
            }
        }
        connection.release();
        res.json({
            success: true,
            message: `Generated ${notificationsCreated} deadline notifications`
        });
    }
    catch (error) {
        console.error('Error generating deadline notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating notifications',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
// Generate notifications for application status updates
async function generateStatusNotifications(req, res) {
    try {
        const connection = await database_1.default.getConnection();
        // Get all recent application status updates
        const [recentUpdates] = await connection.query(`SELECT 
        a.ApplicationID,
        a.StudentID,
        a.ScholarshipID,
        a.Status,
        s.ScholarshipName,
        a.LastUpdated
      FROM application a
      JOIN scholarship s ON a.ScholarshipID = s.ScholarshipID
      WHERE a.Status IN ('Approved', 'Rejected', 'Under Review')
      AND a.LastUpdated > DATE_SUB(NOW(), INTERVAL 1 DAY)`);
        let notificationsCreated = 0;
        for (const update of recentUpdates) {
            // Check if notification already exists
            const [existing] = await connection.query(`SELECT NotificationID FROM notification 
         WHERE ApplicationID = ? AND Type = 'status'`, [update.ApplicationID]);
            if (existing.length === 0) {
                const statusMessage = update.Status === 'Approved'
                    ? `Your application for ${update.ScholarshipName} has been approved!`
                    : update.Status === 'Rejected'
                        ? `Your application for ${update.ScholarshipName} has been rejected.`
                        : `Your application for ${update.ScholarshipName} is under review.`;
                await connection.query(`INSERT INTO notification (StudentID, Type, Title, Message, ApplicationID, ScholarshipID, IsRead)
           VALUES (?, 'status', 'Application Status Updated', ?, ?, ?, FALSE)`, [update.StudentID, statusMessage, update.ApplicationID, update.ScholarshipID]);
                notificationsCreated++;
            }
        }
        connection.release();
        res.json({
            success: true,
            message: `Generated ${notificationsCreated} status notifications`
        });
    }
    catch (error) {
        console.error('Error generating status notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating notifications',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
//# sourceMappingURL=notificationController.js.map