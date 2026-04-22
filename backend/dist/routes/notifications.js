"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notificationController_1 = require("../controllers/notificationController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get all notifications for a user
router.get('/student/:studentId', auth_1.verifyToken, notificationController_1.getNotifications);
// Get unread count
router.get('/student/:studentId/unread', auth_1.verifyToken, notificationController_1.getUnreadCount);
// Mark notification as read
router.put('/:notificationId/read', auth_1.verifyToken, notificationController_1.markAsRead);
// Mark all notifications as read
router.put('/mark-all-read', auth_1.verifyToken, notificationController_1.markAllAsRead);
// Create notification (internal use)
router.post('/', auth_1.verifyToken, notificationController_1.createNotification);
// Delete notification
router.delete('/:notificationId', auth_1.verifyToken, notificationController_1.deleteNotification);
// Generate deadline notifications (can be called periodically)
router.post('/generate/deadlines', notificationController_1.generateDeadlineNotifications);
// Generate status notifications (can be called periodically)
router.post('/generate/status', notificationController_1.generateStatusNotifications);
exports.default = router;
//# sourceMappingURL=notifications.js.map