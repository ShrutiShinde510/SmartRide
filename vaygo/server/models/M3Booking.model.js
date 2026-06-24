const mongoose = require('mongoose');

const m3BookingSchema = new mongoose.Schema({
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'M3Request', required: true },
  familyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'OnDemandDriver', required: true },
  status: { 
    type: String, 
    enum: ['confirmed', 'arriving', 'pre_inspection', 'driving', 'post_inspection', 'completed', 'disputed', 'cancelled'], 
    default: 'confirmed' 
  },
  totalPrice: { type: Number, required: true },
  advancePayment: {
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'paid'], default: 'pending' }
  },
  finalPayment: {
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'paid'], default: 'pending' }
  },
  preInspectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'VehicleInspection' },
  postInspectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'VehicleInspection' },
  driverRating: { type: Number, default: 0 },
  familyRating: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('M3Booking', m3BookingSchema);
