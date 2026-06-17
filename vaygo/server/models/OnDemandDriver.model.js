const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const onDemandDriverSchema = new mongoose.Schema(
  {
    personal_info: {
      full_name:     { type: String, required: true, trim: true },
      phone:         { type: String, required: true, unique: true, trim: true },
      email:         { type: String, unique: true, sparse: true, trim: true, lowercase: true },
      password:      { type: String, required: true, minlength: 6 },
      gender:        { type: String, enum: ['male', 'female', 'other'], default: 'other' },
      profile_photo: { type: String, default: '' } // uploaded during verification step
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
      dl_classes:  { type: [String], enum: ['LMV', 'transport'], default: ['LMV'] },
      dl_verified: { type: Boolean, default: false }
    },
    background_verification: {
      police_cert:      { type: String, default: '' },
      police_cert_date: { type: Date },
      address_proof:    { type: String, default: '' },
      consent_given:    { type: Boolean, required: true, default: false }, // Mandatory checkbox
      bg_verified:      { type: Boolean, default: false }
    },
    experience: {
      years_driving: { type: Number, default: 0 },
      vehicle_types: { type: [String], enum: ['hatchback', 'sedan', 'suv', 'muv'], default: [] },
      languages:     { type: [String], default: [] }
    },
    availability: {
      days:          { type: [String], default: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] },
      time_from:     { type: String, default: '06:00' },
      time_to:       { type: String, default: '22:00' },
      service_areas: { type: [String], default: [] },
      outstation:    { type: Boolean, default: false }
    },
    pricing: {
      rate_per_hour: { type: Number, default: 0 },
      rate_per_trip: { type: Number, default: 0 }
    },
    platform_trust: {
      total_rides_on_vaygo: { type: Number, default: 0 }, // must be 20+ to unlock model 3
      model3_unlocked:      { type: Boolean, default: false },
      hire_rating:          { type: Number, default: 0 },
      total_m3_trips:       { type: Number, default: 0 }
    },
    account: {
      role:           { type: String, default: 'driver_on_demand' },
      model_access:   { type: [Number], default: [3] },
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

onDemandDriverSchema.pre('save', async function (next) {
  if (!this.isModified('personal_info.password')) return next();
  this.personal_info.password = await bcrypt.hash(this.personal_info.password, 12);
  next();
});

onDemandDriverSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.personal_info.password);
};

onDemandDriverSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  if (obj.personal_info) {
    delete obj.personal_info.password;
  }
  return obj;
};

module.exports = mongoose.model('OnDemandDriver', onDemandDriverSchema);
