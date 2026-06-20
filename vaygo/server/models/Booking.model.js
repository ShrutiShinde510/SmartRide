const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  rideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride',
    required: true
  },
  passengerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Passenger',
    required: true
  },
  seatsReserved: {
    type: Number,
    required: true,
    min: 1
  },
  totalFare: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending'
  },
  boardingStatus: {
    type: String,
    enum: ['Waiting', 'Boarded', 'Completed', 'Cancelled'],
    default: 'Waiting'
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
