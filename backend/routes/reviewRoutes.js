const express = require('express');
const router = express.Router();
const { createReview, getVehicleReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createReview);

router.route('/:vehicleId')
  .get(getVehicleReviews);

module.exports = router;
