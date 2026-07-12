const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { vehicle: vehicleId, pickupDate, pickupTime, returnDate, returnTime } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    if (!vehicle.availability) {
      return res.status(400).json({ message: 'Vehicle is not available for booking' });
    }

    if (vehicle.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot book your own vehicle' });
    }

    const start = new Date(`${pickupDate}T${pickupTime}`);
    const end = new Date(`${returnDate}T${returnTime}`);
    const now = new Date();

    if (start < now) {
      return res.status(400).json({ message: 'Pickup date cannot be in the past' });
    }
    if (end <= start) {
      return res.status(400).json({ message: 'Return date and time must be after pickup' });
    }

    // Check for overlapping bookings
    const overlappingBookings = await Booking.find({
      vehicle: vehicleId,
      bookingStatus: { $in: ['Pending', 'Accepted', 'Active'] },
      $or: [
        { pickupDate: { $lte: end }, returnDate: { $gte: start } }
      ]
    });

    // We do a more precise check in memory for the time since the DB query is on Date objects containing time
    const hasOverlap = overlappingBookings.some(b => {
      const bStart = new Date(`${b.pickupDate.toISOString().split('T')[0]}T${b.pickupTime}`);
      const bEnd = new Date(`${b.returnDate.toISOString().split('T')[0]}T${b.returnTime}`);
      return (start < bEnd && end > bStart);
    });

    if (hasOverlap) {
      return res.status(400).json({ message: 'Vehicle is already booked for these dates' });
    }

    // Calculate duration
    const diffMs = end - start;
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = Math.ceil(diffHours / 24);

    let rentalCost = 0;
    if (diffHours < 24) {
      rentalCost = Math.ceil(diffHours) * vehicle.pricePerHour;
    } else {
      rentalCost = diffDays * vehicle.pricePerDay;
    }

    const grandTotal = rentalCost + vehicle.securityDeposit;

    const booking = await Booking.create({
      customer: req.user._id,
      owner: vehicle.owner,
      vehicle: vehicle._id,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      rentalHours: Math.ceil(diffHours),
      rentalDays: diffDays,
      rentalCost,
      securityDeposit: vehicle.securityDeposit,
      grandTotal,
      timeline: [{ status: 'Created' }]
    });

    await booking.populate('owner', 'name email');
    await booking.populate('customer', 'name email');
    await booking.populate('vehicle', 'brand model');

    res.status(201).json(booking);
  } catch (error) {
    console.error('createBooking Error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get logged in user's bookings (Customer)
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Booking.countDocuments({ customer: req.user._id });
    const bookings = await Booking.find({ customer: req.user._id })
      .populate('vehicle', 'brand model images type pricePerDay pricePerHour')
      .populate('owner', 'name phone email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    res.json({
      bookings,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
      total
    });
  } catch (error) {
    console.error('getMyBookings Error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get bookings for owner's vehicles
// @route   GET /api/bookings/owner
// @access  Private
const getOwnerBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Booking.countDocuments({ owner: req.user._id });
    const bookings = await Booking.find({ owner: req.user._id })
      .populate('vehicle', 'brand model images type registrationNumber')
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    res.json({
      bookings,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
      total
    });
  } catch (error) {
    console.error('getOwnerBookings Error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('vehicle', 'brand model images type registrationNumber pricePerDay pricePerHour securityDeposit pickupAddress')
      .populate('customer', 'name email phone')
      .populate('owner', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Ensure only the customer or owner can view it
    if (booking.customer._id.toString() !== req.user._id.toString() && 
        booking.owner._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    console.error('getBookingById Error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Cancel booking (Customer)
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.bookingStatus !== 'Pending') {
      return res.status(400).json({ message: 'Can only cancel pending bookings' });
    }

    booking.bookingStatus = 'Cancelled';
    booking.timeline.push({ status: 'Cancelled' });
    await booking.save();

    res.json(booking);
  } catch (error) {
    console.error('cancelBooking Error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Accept booking (Owner)
// @route   PATCH /api/bookings/:id/accept
// @access  Private
const acceptBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to accept this booking' });
    }

    if (booking.bookingStatus !== 'Pending') {
      return res.status(400).json({ message: 'Can only accept pending bookings' });
    }

    booking.bookingStatus = 'Accepted';
    booking.timeline.push({ status: 'Accepted' });
    await booking.save();

    res.json(booking);
  } catch (error) {
    console.error('acceptBooking Error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Reject booking (Owner)
// @route   PATCH /api/bookings/:id/reject
// @access  Private
const rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to reject this booking' });
    }

    if (booking.bookingStatus !== 'Pending') {
      return res.status(400).json({ message: 'Can only reject pending bookings' });
    }

    booking.bookingStatus = 'Rejected';
    booking.timeline.push({ status: 'Rejected' });
    await booking.save();

    res.json(booking);
  } catch (error) {
    console.error('rejectBooking Error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Mark payment as received (Owner)
// @route   PATCH /api/bookings/:id/payment
// @access  Private
const markPaymentReceived = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this payment' });
    }

    if (booking.bookingStatus !== 'Accepted' && booking.bookingStatus !== 'Active') {
      return res.status(400).json({ message: 'Booking must be accepted before marking payment received' });
    }

    booking.paymentStatus = 'Received';
    booking.timeline.push({ status: 'Payment Received' });
    // If payment is received, booking becomes active if it was accepted
    if (booking.bookingStatus === 'Accepted') {
      booking.bookingStatus = 'Active';
      booking.timeline.push({ status: 'Active' });
    }
    await booking.save();

    res.json(booking);
  } catch (error) {
    console.error('markPaymentReceived Error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Mark booking as completed (Owner)
// @route   PATCH /api/bookings/:id/complete
// @access  Private
const completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to complete this booking' });
    }

    if (booking.bookingStatus !== 'Active') {
      return res.status(400).json({ message: 'Can only complete active bookings' });
    }

    booking.bookingStatus = 'Completed';
    booking.timeline.push({ status: 'Completed' });
    await booking.save();

    res.json(booking);
  } catch (error) {
    console.error('completeBooking Error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  getBookingById,
  cancelBooking,
  acceptBooking,
  rejectBooking,
  markPaymentReceived,
  completeBooking,
};
