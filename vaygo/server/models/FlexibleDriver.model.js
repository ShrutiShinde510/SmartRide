const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const flexibleDriverSchema = new mongoose.Schema(
  {
    personal_info: {
      full_name:     { type: String, required: true, trim: true },
      phone:         { type: String, required: true, unique: true, trim: true },
      email:         { type: String, unique: true, sparse: true, trim: true, lowercase: true },
      password:      { type: String, required: true, minlength: 6 },
      gender:        { type: String, enum: ['male', 'female', 'other'], default: 'other' },
      profile_photo: { type: String, default: '' }
    },
    kyc: {
      aadhaar_number:   { type: String, default: '' },
      aadhaar_front:    { type: String, default: '' },
      aadhaar_back:     { type: String, default: '' },
      aadhaar_verified: { type: Boolean, default: false },
      pan_number:       { type: String, default: '' },
      pan_verified:     { type: Boolean, default: false },
      selfie:           { type: String, default: '' },
      face_verified:    { type: Boolean, default: false }
    },
    driving_licence: {
      dl_number:   { type: String, default: '' },
      dl_front:    { type: String, default: '' },
      dl_back:     { type: String, default: '' },
      dl_expiry:   { type: Date },
      dl_verified: { type: Boolean, default: false }
    },
    vehicle: {
      type:            { type: String, enum: ['hatchback', 'sedan', 'suv', 'muv', 'van'], default: 'sedan' },
      brand:           { type: String, default: '' },
      model:           { type: String, default: '' },
      registration_no: { type: String, default: '' },
      rc_book:         { type: String, default: '' },
      photos: {
        front:    { type: String, default: '' },
        back:     { type: String, default: '' },
        interior: { type: String, default: '' },
        boot:     { type: String, default: '' }
      },
      total_seats:      { type: Number, default: 4 },
      ac:               { type: Boolean, default: true },
      luggage_capacity: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
      fuel_type:        { type: String, enum: ['petrol', 'diesel', 'cng', 'ev'], default: 'petrol' }
    },
    availability: {
      days:            { type: [String], default: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] },
      time_from:       { type: String, default: '06:00' },
      time_to:         { type: String, default: '22:00' },
      min_booking_hrs: { type: Number, default: 4 },
      service_areas:   { type: [String], default: [] },
      max_radius_km:   { type: Number, default: 50 },
      outstation:      { type: Boolean, default: false }
    },
    pricing: {
      rate_per_hour: { type: Number, default: 0 },
      rate_per_km:   { type: Number, default: 0 },
      base_fare:     { type: Number, default: 0 }
    },
    account: {
      role:           { type: String, default: 'driver_hire' },
      model_access:   { type: [Number], default: [2] },
      account_status: { type: String, enum: ['pending', 'active', 'suspended'], default: 'pending' },
      safety_score:   { type: Number, default: 100 }
    },
    trusted_contacts: [
      {
        name:  { type: String, default: '' },
        phone: { type: String, default: '' }
      }
    ],
    language: { type: String, default: 'en' },
    city:     { type: String, default: '' },
    state:    { type: String, default: '' }
  },
  { timestamps: true }
);

flexibleDriverSchema.pre('save', async function (next) {
  if (!this.isModified('personal_info.password')) return next();
  this.personal_info.password = await bcrypt.hash(this.personal_info.password, 12);
  next();
});

flexibleDriverSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.personal_info.password);
};

flexibleDriverSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  if (obj.personal_info) {
    delete obj.personal_info.password;
  }
  return obj;
};

module.exports = mongoose.model('FlexibleDriver', flexibleDriverSchema);
