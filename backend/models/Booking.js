const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Vehicle',
    },
    pickupDate: {
      type: Date,
      required: true,
    },
    pickupTime: {
      type: String,
      required: true,
    },
    returnDate: {
      type: Date,
      required: true,
    },
    returnTime: {
      type: String,
      required: true,
    },
    rentalHours: {
      type: Number,
      required: true,
    },
    rentalDays: {
      type: Number,
      required: true,
    },
    rentalCost: {
      type: Number,
      required: true,
    },
    securityDeposit: {
      type: Number,
      required: true,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
    bookingStatus: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'Active', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Received'],
      default: 'Pending',
    },
    paymentMode: {
      type: String,
      default: 'Offline',
      enum: ['Offline'],
    },
    timeline: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
