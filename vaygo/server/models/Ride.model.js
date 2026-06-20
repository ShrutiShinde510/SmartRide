const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlannedDriver',
    required: true
  },
  from: {
    type: String,
    required: true
  },
  startLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  to: {
    type: String,
    required: true
  },
  endLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  bookedSeats: {
    type: Number,
    default: 0
  },
  pricePerSeat: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Active', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  }
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);
