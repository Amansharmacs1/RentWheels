const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  getBookingById,
  cancelBooking,
  acceptBooking,
  rejectBooking,
  markPaymentReceived,
  completeBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/owner', protect, getOwnerBookings);
router.get('/:id', protect, getBookingById);

router.patch('/:id/cancel', protect, cancelBooking);
router.patch('/:id/accept', protect, acceptBooking);
router.patch('/:id/reject', protect, rejectBooking);
router.patch('/:id/payment', protect, markPaymentReceived);
router.patch('/:id/complete', protect, completeBooking);

module.exports = router;
