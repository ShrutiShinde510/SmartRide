const mongoose = require('mongoose');

const vehicleInspectionSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'M3Booking', required: true },
  type: { type: String, enum: ['pre', 'post'], required: true },
  photos: {
    front: { type: String, required: true },
    back: { type: String, required: true },
    left: { type: String, required: true },
    right: { type: String, required: true }
  },
  aiResult: {
    isDamaged: { type: Boolean, default: false },
    confidenceScore: { type: Number, default: 100 },
    notes: { type: String, default: 'Clean' }
  }
}, { timestamps: true });

module.exports = mongoose.model('VehicleInspection', vehicleInspectionSchema);
