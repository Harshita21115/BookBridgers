const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const {
  createAppointment,
  getUserAppointments,
  getLibraryAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getAvailableTimeSlots
} = require('../controllers/appointmentController');

// All routes require authentication
router.use(protect);

// User appointment routes
router.post('/', createAppointment);
router.get('/my-appointments', getUserAppointments);
router.put('/:id/cancel', cancelAppointment);

// Library appointment routes
router.get('/library/:libraryId', getLibraryAppointments);
router.get('/library/:libraryId/available-slots', getAvailableTimeSlots);

// Admin routes
router.put('/:id/status', restrictTo('admin'), updateAppointmentStatus);

module.exports = router;
