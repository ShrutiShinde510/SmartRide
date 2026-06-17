const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
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
    trusted_contacts: [
      {
        name:  { type: String, default: '' },
        phone: { type: String, default: '' }
      }
    ],
    account: {
      role:           { type: String, default: 'passenger' },
      model_access:   { type: [Number], default: [1] },
      account_status: { type: String, enum: ['pending', 'active', 'suspended'], default: 'active' }, // Passengers default to active
      safety_score:   { type: Number, default: 100 }
    },
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

userSchema.pre('save', async function (next) {
  if (!this.isModified('personal_info.password')) return next();
  this.personal_info.password = await bcrypt.hash(this.personal_info.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.personal_info.password);
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  if (obj.personal_info) {
    delete obj.personal_info.password;
  }
  return obj;
};

module.exports = mongoose.model('User', userSchema);
