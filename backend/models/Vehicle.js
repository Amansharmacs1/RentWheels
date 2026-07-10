const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    type: {
      type: String,
      required: true,
      enum: ['Car', 'Bike'],
    },
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    fuelType: {
      type: String,
      required: true,
    },
    transmission: {
      type: String,
      required: true,
    },
    seatingCapacity: {
      type: Number,
      required: function() {
        return this.type === 'Car';
      },
    },
    engineCapacity: {
      type: Number,
      required: function() {
        return this.type === 'Bike';
      },
    },
    pricePerHour: {
      type: Number,
      required: true,
      min: 0,
    },
    pricePerDay: {
      type: Number,
      required: true,
      min: 0,
    },
    securityDeposit: {
      type: Number,
      required: true,
      min: 0,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    pickupAddress: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
    },
    insuranceValidTill: {
      type: Date,
      required: true,
    },
    images: {
      type: [String],
      required: true,
      validate: [arrayLimit, '{PATH} needs at least 1 image'],
    },
    availability: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

function arrayLimit(val) {
  return val.length > 0;
}

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
module.exports = Vehicle;
