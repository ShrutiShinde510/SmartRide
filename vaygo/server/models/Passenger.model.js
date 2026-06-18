const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Passenger Model — minimal schema
 * MongoDB Collection: passengers
 * Stores only: name, phone, email, password, city, emergency contact
 */
const passengerSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true, trim: true },
    phone:     { type: String, required: true, unique: true, trim: true },
    email:     { type: String, unique: true, sparse: true, trim: true, lowercase: true },
    password:  { type: String, required: true, minlength: 6 },
    gender:    { type: String, enum: ['male', 'female', 'other'], default: 'other' },
    city:      { type: String, default: '' },

    // Single emergency / trusted contact
    emergency_contact: {
      name:  { type: String, default: '' },
      phone: { type: String, default: '' }
    },

    // Minimal account info needed for auth
    role:           { type: String, default: 'passenger' },
    account_status: { type: String, enum: ['active', 'suspended'], default: 'active' }
  },
  { timestamps: true }
);

// Hash password before saving
passengerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare entered password with stored hash
passengerSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

// Strip password from response
passengerSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// account property shim so existing auth middleware (role check) still works
passengerSchema.virtual('account').get(function () {
  return { role: this.role, account_status: this.account_status };
});

module.exports = mongoose.model('Passenger', passengerSchema, 'passengers');
