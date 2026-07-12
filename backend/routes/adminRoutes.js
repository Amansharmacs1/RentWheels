const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  getVehicles,
  verifyVehicle,
  rejectVehicle,
  getBookings,
  exportReportsCSV
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes require authentication AND admin privileges
router.use(protect, admin);

router.get('/dashboard', getDashboardStats);

router.route('/users')
  .get(getUsers);
router.patch('/users/:id/status', updateUserStatus);

router.route('/vehicles')
  .get(getVehicles);
router.patch('/vehicles/:id/verify', verifyVehicle);
router.patch('/vehicles/:id/reject', rejectVehicle);

router.route('/bookings')
  .get(getBookings);

router.get('/reports/:type/csv', exportReportsCSV);

module.exports = router;
