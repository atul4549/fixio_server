// routes/notificationRoutes.js
import express from 'express';
import { getAllNotifications } from '../controllers/service.controller.js';
// import {
//   getAllNotifications,
//   markNotificationAsRead,
//   markAllAsRead,
//   deleteNotification,
//   deleteAllNotifications
// } from '../controllers/notificationController.js';

const router = express.Router();

// GET all notifications (with optional sendTo query param)
router.get('/', getAllNotifications);

// // PATCH mark single notification as read
// router.patch('/:id/read', markNotificationAsRead);

// // POST mark multiple notifications as read
// router.post('/mark-all-read', markAllAsRead);

// // DELETE single notification
// router.delete('/:id', deleteNotification);

// // POST delete multiple notifications
// router.post('/delete-all', deleteAllNotifications);

export { router as notificationsRoute};