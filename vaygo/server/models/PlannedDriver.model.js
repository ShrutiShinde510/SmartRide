const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const plannedDriverSchema = new mongoose.Schema(
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
      type:            { type: String, enum: ['hatchback', 'sedan', 'suv', 'muv'], default: 'sedan' },
      brand:           { type: String, default: '' },
      model:           { type: String, default: '' },
      registration_no: { type: String, default: '' },
      rc_book:         { type: String, default: '' },
      photos: {
        front:    { type: String, default: '' },
        back:     { type: String, default: '' },
        interior: { type: String, default: '' }
      },
      total_seats:     { type: Number, default: 4 },
      ac:              { type: Boolean, default: true },
      luggage_space:   { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
      fuel_type:       { type: String, enum: ['petrol', 'diesel', 'cng', 'ev'], default: 'petrol' }
    },
    preferences: {
      gender_pref:      { type: String, enum: ['any', 'female_only', 'male_only'], default: 'any' },
      smoking_allowed:  { type: Boolean, default: false },
      luggage_allowed:  { type: Boolean, default: true }
    },
    account: {
      role:           { type: String, default: 'driver_planned' },
      model_access:   { type: [Number], default: [1] },
      account_status: { type: String, enum: ['pending', 'active', 'suspended'], default: 'pending' },
      safety_score:   { type: Number, default: 100 }
    },
    trusted_contacts: [
      {
        name:  { type: String, default: '' },
        phone: { type: String, default: '' }
      }
    ],
    planned_trips: [
      {
        source:      { type: String, default: '' },
        destination: { type: String, default: '' },
        date:        { type: Date },
        time:        { type: String, default: '' },
        status:      { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' }
      }
    ],
    language: { type: String, default: 'en' },
    city:     { type: String, default: '' },
    state:    { type: String, default: '' }
  },
  { timestamps: true }
);

plannedDriverSchema.pre('save', async function (next) {
  if (!this.isModified('personal_info.password')) return next();
  this.personal_info.password = await bcrypt.hash(this.personal_info.password, 12);
  next();
});

plannedDriverSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.personal_info.password);
};

plannedDriverSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  if (obj.personal_info) {
    delete obj.personal_info.password;
  }
  return obj;
};

module.exports = mongoose.model('PlannedDriver', plannedDriverSchema);
