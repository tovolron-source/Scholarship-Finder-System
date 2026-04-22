import express from 'express';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  createNotification,
  deleteNotification,
  generateDeadlineNotifications,
  generateStatusNotifications
} from '../controllers/notificationController';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

// Get all notifications for a user
router.get('/student/:studentId', verifyToken, getNotifications);

// Get unread count
router.get('/student/:studentId/unread', verifyToken, getUnreadCount);

// Mark notification as read
router.put('/:notificationId/read', verifyToken, markAsRead);

// Mark all notifications as read
router.put('/mark-all-read', verifyToken, markAllAsRead);

// Create notification (internal use)
router.post('/', verifyToken, createNotification);

// Delete notification
router.delete('/:notificationId', verifyToken, deleteNotification);

// Generate deadline notifications (can be called periodically)
router.post('/generate/deadlines', generateDeadlineNotifications);

// Generate status notifications (can be called periodically)
router.post('/generate/status', generateStatusNotifications);

export default router;
