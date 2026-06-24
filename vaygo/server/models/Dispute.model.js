const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'M3Booking', required: true },
  raisedBy: { type: String, enum: ['family', 'driver'], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['open', 'investigating', 'resolved', 'rejected'], default: 'open' },
  adminNotes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Dispute', disputeSchema);
