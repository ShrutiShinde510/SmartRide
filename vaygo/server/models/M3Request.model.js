const mongoose = require('mongoose');

const m3RequestSchema = new mongoose.Schema({
  familyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  carDetails: {
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: String, required: true },
    transmission: { type: String, enum: ['manual', 'automatic'], default: 'manual' }
  },
  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
  date: { type: Date, required: true },
  durationHours: { type: Number, required: true },
  estimatedPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'driver_confirmation_pending', 'accepted', 'cancelled'], default: 'pending' },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'OnDemandDriver' },
  interestedDrivers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OnDemandDriver' }]
}, { timestamps: true });

module.exports = mongoose.model('M3Request', m3RequestSchema);
