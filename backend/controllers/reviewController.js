const Review = require('../models/Review');
const Booking = require('../models/Booking');

// Create a new review
const createReview = async (req, res) => {
  try {
    const { bookingId, vehicleId, rating, title, description } = req.body;

    // Check if the user is a customer
    if (req.user.role !== 'Customer' && req.user.role !== 'User') {
      // Actually we allowed any user to be Customer, but let's just make sure they are not strictly Owner 
      // although we removed strict roles on frontend. Let's just check booking ownership.
    }

    // Check if booking exists, belongs to user, and is Completed
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to review this booking' });
    }

    if (booking.status !== 'Completed') {
      return res.status(400).json({ message: 'You can only review completed bookings' });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({ customer: req.user._id, booking: bookingId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this booking' });
    }

    const review = await Review.create({
      customer: req.user._id,
      booking: bookingId,
      vehicle: vehicleId,
      rating,
      title,
      description
    });

    // Update vehicle stats
    const vehicle = await require('../models/Vehicle').findById(vehicleId);
    if (vehicle) {
      const newCount = vehicle.reviewCount + 1;
      const newAvg = ((vehicle.averageRating * vehicle.reviewCount) + rating) / newCount;
      vehicle.reviewCount = newCount;
      vehicle.averageRating = newAvg;
      await vehicle.save();
    }

    res.status(201).json(review);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this booking' });
    }
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// Get reviews for a vehicle
const getVehicleReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Review.countDocuments({ vehicle: req.params.vehicleId });
    const reviews = await Review.find({ vehicle: req.params.vehicleId })
      .populate('customer', 'name profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    res.json({
      reviews,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createReview,
  getVehicleReviews
};
