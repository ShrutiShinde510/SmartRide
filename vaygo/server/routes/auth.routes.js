const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');           // legacy – kept for backward compat
const Passenger = require('../models/Passenger.model'); // dedicated passenger collection
const PlannedDriver = require('../models/PlannedDriver.model');
const FlexibleDriver = require('../models/FlexibleDriver.model');
const OnDemandDriver = require('../models/OnDemandDriver.model');
const authMiddleware = require('../middleware/auth.middleware');
const admin = require('../utils/firebase.admin');

// Helper to generate JWT
const generateToken = (user) => {
  const role = user.account ? user.account.role : user.role;
  return jwt.sign({ id: user._id, role: role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '1h',
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  try {
    const {
      name, full_name,
      phone,
      email,
      password,
      gender,
      role,
      language,
      emergency_contact, trusted_contacts,
      vehicle_details,
      driver_experience,
      city,
      state
    } = req.body;

    const resolvedRole = (role || 'passenger').toLowerCase();

    // Check if phone already registered (Passenger uses flat 'phone', drivers use nested)
    const existsPhone = await Passenger.findOne({ phone }) ||
                        await User.findOne({ 'personal_info.phone': phone }) ||
                        await PlannedDriver.findOne({ 'personal_info.phone': phone }) ||
                        await FlexibleDriver.findOne({ 'personal_info.phone': phone }) ||
                        await OnDemandDriver.findOne({ 'personal_info.phone': phone });
    if (existsPhone) {
      return res.status(400).json({ success: false, message: 'Phone number already registered' });
    }

    // Check if email already registered (Passenger uses flat 'email')
    if (email) {
      const existsEmail = await Passenger.findOne({ email }) ||
                          await User.findOne({ 'personal_info.email': email }) ||
                          await PlannedDriver.findOne({ 'personal_info.email': email }) ||
                          await FlexibleDriver.findOne({ 'personal_info.email': email }) ||
                          await OnDemandDriver.findOne({ 'personal_info.email': email });
      if (existsEmail) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
      }
    }

    // Choose target model — passengers go to dedicated 'passengers' collection
    let TargetModel = Passenger; // default: passenger
    if (resolvedRole === 'driver_planned') TargetModel = PlannedDriver;
    else if (resolvedRole === 'driver_hire') TargetModel = FlexibleDriver;
    else if (resolvedRole === 'driver_on_demand') TargetModel = OnDemandDriver;

    // ── PASSENGER: use flat minimal schema ──────────────────────────────
    if (resolvedRole === 'passenger') {
      const passengerData = {
        full_name: full_name || name || '',
        phone,
        email: email || undefined,
        password,
        gender: (gender || 'other').toLowerCase(),
        city: city || '',
        emergency_contact: {
          name:  emergency_contact?.name  || (trusted_contacts?.[0]?.name)  || '',
          phone: emergency_contact?.phone || (trusted_contacts?.[0]?.phone) || ''
        },
        role:           'passenger',
        account_status: 'active'
      };

      const newPassenger = new Passenger(passengerData);
      await newPassenger.save();

      const token = generateToken(newPassenger);
      return res.status(201).json({
        success: true,
        token,
        user: newPassenger.toSafeObject()
      });
    }

    // ── DRIVERS: use nested schema (personal_info / kyc / account) ───────
    const baseData = {
      personal_info: {
        full_name: full_name || name || '',
        phone,
        email: email || undefined,
        password,
        gender: (gender || 'other').toLowerCase(),
        profile_photo: req.body.profile_photo || ''
      },
      kyc: {
        aadhaar_number: req.body.aadhaar_number || '',
        aadhaar_front: req.body.aadhaar_front || '',
        aadhaar_back: req.body.aadhaar_back || '',
        aadhaar_verified: req.body.aadhaar_verified || false,
        pan_number: req.body.pan_number || '',
        pan_verified: req.body.pan_verified || false,
        selfie: req.body.selfie || '',
        face_verified: req.body.face_verified || false
      },
      account: {
        role: resolvedRole,
        model_access: req.body.model_access || (resolvedRole === 'driver_planned' ? [1] : resolvedRole === 'driver_hire' ? [2] : [3]),
        account_status: 'pending',
        safety_score: 100
      },
      language: language || 'en',
      city: city || '',
      state: state || ''
    };

    let userData = { ...baseData };

    if (resolvedRole === 'driver_planned') {
      userData.driving_licence = {
        dl_number: req.body.dl_number || '',
        dl_front: req.body.dl_front || '',
        dl_back: req.body.dl_back || '',
        dl_expiry: req.body.dl_expiry,
        dl_verified: req.body.dl_verified || false
      };
      // Map old dashboard vehicle_details parameters or use defaults
      const regNo = vehicle_details?.vehicle_number || req.body.vehicle_reg_no || '';
      const vType = vehicle_details?.vehicle_type || req.body.vehicle_type || 'sedan';
      const seats = vehicle_details?.seating_capacity || req.body.vehicle_seats || 4;
      userData.vehicle = {
        type: vType.toLowerCase(),
        brand: req.body.vehicle_brand || '',
        model: req.body.vehicle_model || '',
        registration_no: regNo,
        rc_book: vehicle_details?.rc_book_url || req.body.vehicle_rc_book || '',
        photos: {
          front: req.body.vehicle_photo_front || '',
          back: req.body.vehicle_photo_back || '',
          interior: req.body.vehicle_photo_interior || ''
        },
        total_seats: seats,
        ac: req.body.vehicle_ac !== undefined ? req.body.vehicle_ac : true,
        luggage_space: req.body.vehicle_luggage || 'medium',
        fuel_type: req.body.vehicle_fuel || 'petrol'
      };
    }

    if (resolvedRole === 'driver_hire') {
      userData.driving_licence = {
        dl_number: req.body.dl_number || '',
        dl_front: req.body.dl_front || '',
        dl_back: req.body.dl_back || '',
        dl_expiry: req.body.dl_expiry,
        dl_verified: req.body.dl_verified || false
      };
      const regNo = vehicle_details?.vehicle_number || req.body.vehicle_reg_no || '';
      const vType = vehicle_details?.vehicle_type || req.body.vehicle_type || 'sedan';
      const seats = vehicle_details?.seating_capacity || req.body.vehicle_seats || 4;
      userData.vehicle = {
        type: vType.toLowerCase(),
        brand: req.body.vehicle_brand || '',
        model: req.body.vehicle_model || '',
        registration_no: regNo,
        rc_book: vehicle_details?.rc_book_url || req.body.vehicle_rc_book || '',
        photos: {
          front: req.body.vehicle_photo_front || '',
          back: req.body.vehicle_photo_back || '',
          interior: req.body.vehicle_photo_interior || '',
          boot: req.body.vehicle_photo_boot || ''
        },
        total_seats: seats,
        ac: req.body.vehicle_ac !== undefined ? req.body.vehicle_ac : true,
        luggage_capacity: req.body.vehicle_luggage || 'medium',
        fuel_type: req.body.vehicle_fuel || 'petrol'
      };
      userData.availability = {
        days: req.body.avail_days || ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
        time_from: req.body.avail_time_from || '06:00',
        time_to: req.body.avail_time_to || '22:00',
        min_booking_hrs: req.body.avail_min_hrs || 4,
        service_areas: req.body.avail_areas || [],
        max_radius_km: req.body.avail_radius || 50,
        outstation: req.body.avail_outstation || false
      };
      userData.pricing = {
        rate_per_hour: req.body.price_hourly || 0,
        rate_per_km: req.body.price_km || 0,
        base_fare: req.body.price_base || 0
      };
    }

    if (resolvedRole === 'driver_on_demand') {
      userData.driving_licence = {
        dl_number: req.body.dl_number || '',
        dl_front: req.body.dl_front || '',
        dl_back: req.body.dl_back || '',
        dl_expiry: req.body.dl_expiry,
        dl_classes: req.body.dl_classes || ['LMV'],
        dl_verified: req.body.dl_verified || false
      };
      userData.background_verification = {
        police_cert: req.body.bg_police_cert || '',
        police_cert_date: req.body.bg_police_date,
        address_proof: req.body.bg_address_proof || '',
        consent_given: req.body.bg_consent || true, // default consent
        bg_verified: false
      };
      userData.experience = {
        years_driving: driver_experience?.years_of_experience || req.body.exp_years || 0,
        vehicle_types: req.body.exp_vehicles || [],
        languages: driver_experience?.languages_known || req.body.exp_languages || []
      };
      userData.availability = {
        days: driver_experience?.available_days || req.body.avail_days || ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
        time_from: req.body.avail_time_from || '06:00',
        time_to: req.body.avail_time_to || '22:00',
        service_areas: driver_experience?.preferred_cities || req.body.avail_areas || [],
        outstation: req.body.avail_outstation || false
      };
      userData.pricing = {
        rate_per_hour: driver_experience?.hourly_charges || req.body.price_hourly || 0,
        rate_per_trip: driver_experience?.km_charges || req.body.price_trip || 0
      };
      userData.platform_trust = {
        total_rides_on_vaygo: req.body.trust_rides || 0,
        model3_unlocked: req.body.trust_unlocked || false,
        hire_rating: 0,
        total_m3_trips: 0
      };
    }

    const newUser = new TargetModel(userData);
    await newUser.save();

    const token = generateToken(newUser);
    res.status(201).json({
      success: true,
      token,
      user: newUser.toSafeObject(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Passenger uses flat 'phone'; drivers use nested 'personal_info.phone'
    let user = await Passenger.findOne({ phone }) ||
               await User.findOne({ 'personal_info.phone': phone }) ||
               await PlannedDriver.findOne({ 'personal_info.phone': phone }) ||
               await FlexibleDriver.findOne({ 'personal_info.phone': phone }) ||
               await OnDemandDriver.findOne({ 'personal_info.phone': phone });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid phone number or password' });
    }

    // Match password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid phone number or password' });
    }

    const token = generateToken(user);
    res.json({
      success: true,
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user.toSafeObject(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/auth/verify-documents
// @desc    Simulate/Mock verification for Drivers and Drivers-on-Demand
router.post('/verify-documents', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const resolvedRole = (user.account?.role || user.role || '').toLowerCase();

    // Update driving licence details if provided
    if (req.body.driving_licence) {
      user.driving_licence = {
        ...user.driving_licence,
        dl_number: req.body.driving_licence.dl_number || user.driving_licence?.dl_number,
        dl_expiry: req.body.driving_licence.dl_expiry || user.driving_licence?.dl_expiry,
        dl_verified: true
      };
      if (resolvedRole === 'driver_on_demand' && req.body.driving_licence.dl_classes) {
        user.driving_licence.dl_classes = req.body.driving_licence.dl_classes;
      }
    }

    // Update KYC details if provided
    if (req.body.kyc) {
      user.kyc = {
        ...user.kyc,
        aadhaar_number: req.body.kyc.aadhaar_number || user.kyc?.aadhaar_number,
        pan_number: req.body.kyc.pan_number || user.kyc?.pan_number,
        aadhaar_verified: true,
        pan_verified: true,
        face_verified: true
      };
    } else {
      user.kyc.aadhaar_verified = true;
      user.kyc.face_verified = true;
      user.kyc.pan_verified = true;
    }

    if (user.driving_licence) {
      user.driving_licence.dl_verified = true;
    }

    if (resolvedRole === 'driver_planned') {
      const v = req.body.vehicle || {};
      user.vehicle = {
        type: (v.type || 'sedan').toLowerCase(),
        brand: v.brand || '',
        model: v.model || '',
        registration_no: v.registration_no || '',
        rc_book: 'mock_rc_book_url.pdf',
        photos: {
          front: 'mock_front.jpg',
          back: 'mock_back.jpg',
          interior: 'mock_interior.jpg'
        },
        total_seats: Number(v.total_seats) || 4,
        ac: v.ac !== undefined ? v.ac : true,
        luggage_space: v.luggage_space || 'medium',
        fuel_type: v.fuel_type || 'petrol'
      };

      // Save carpool preferences
      const pref = req.body.preferences || {};
      user.preferences = {
        gender_pref:     pref.gender_pref || 'any',
        smoking_allowed: pref.smoking_allowed !== undefined ? pref.smoking_allowed : false,
        luggage_allowed: pref.luggage_allowed !== undefined ? pref.luggage_allowed : true
      };
    }

    if (resolvedRole === 'driver_hire') {
      const v = req.body.vehicle || {};
      user.vehicle = {
        type: (v.type || 'sedan').toLowerCase(),
        brand: v.brand || '',
        model: v.model || '',
        registration_no: v.registration_no || '',
        rc_book: 'mock_rc_book_url.pdf',
        photos: {
          front: 'mock_front.jpg',
          back: 'mock_back.jpg',
          interior: 'mock_interior.jpg',
          boot: 'mock_boot.jpg'
        },
        total_seats: Number(v.total_seats) || 4,
        ac: v.ac !== undefined ? v.ac : true,
        luggage_capacity: v.luggage_capacity || 'medium',
        fuel_type: v.fuel_type || 'petrol'
      };

      const avail = req.body.availability || {};
      user.availability = {
        days: avail.days || ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
        time_from: avail.time_from || '06:00',
        time_to: avail.time_to || '22:00',
        min_booking_hrs: Number(avail.min_booking_hrs) || 4,
        service_areas: avail.service_areas || [],
        max_radius_km: Number(avail.max_radius_km) || 50,
        outstation: avail.outstation !== undefined ? avail.outstation : false
      };

      const prc = req.body.pricing || {};
      user.pricing = {
        rate_per_hour: Number(prc.rate_per_hour) || 0,
        rate_per_km: Number(prc.rate_per_km) || 0,
        base_fare: Number(prc.base_fare) || 0
      };
    }

    if (resolvedRole === 'driver_on_demand') {
      const bg = req.body.background_verification || {};
      user.background_verification = {
        police_cert: 'mock_police_cert.pdf',
        police_cert_date: bg.police_cert_date || new Date(),
        address_proof: 'mock_address_proof.pdf',
        consent_given: bg.consent_given !== undefined ? bg.consent_given : true,
        bg_verified: true
      };

      const exp = req.body.experience || {};
      user.experience = {
        years_driving: Number(exp.years_driving) || 0,
        vehicle_types: exp.vehicle_types || [],
        languages: exp.languages || []
      };

      const avail = req.body.availability || {};
      user.availability = {
        days: avail.days || ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
        time_from: avail.time_from || '06:00',
        time_to: avail.time_to || '22:00',
        service_areas: avail.service_areas || [],
        outstation: avail.outstation !== undefined ? avail.outstation : false
      };

      const prc = req.body.pricing || {};
      user.pricing = {
        rate_per_hour: Number(prc.rate_per_hour) || 0,
        rate_per_trip: Number(prc.rate_per_trip) || 0
      };

      if (user.platform_trust) {
        user.platform_trust.model3_unlocked = true;
      }
    }

    user.account.account_status = 'active';
    await user.save();

    res.json({
      success: true,
      message: 'Documents successfully verified!',
      user: user.toSafeObject(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Verification error' });
  }
});

// @route   PUT /api/auth/update-rates
// @desc    Update pricing rates for drivers
router.put('/update-rates', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const resolvedRole = (user.account?.role || user.role || '').toLowerCase();

    if (resolvedRole === 'driver_hire' || resolvedRole === 'driver_on_demand') {
      const { rate_per_hour, rate_per_km, rate_per_trip, base_fare } = req.body;
      if (!user.pricing) user.pricing = {};
      if (rate_per_hour !== undefined) user.pricing.rate_per_hour = Number(rate_per_hour);
      if (rate_per_km !== undefined) user.pricing.rate_per_km = Number(rate_per_km);
      if (rate_per_trip !== undefined) user.pricing.rate_per_trip = Number(rate_per_trip);
      if (base_fare !== undefined) user.pricing.base_fare = Number(base_fare);
      
      await user.save();
      return res.json({
        success: true,
        message: 'Pricing rates updated successfully',
        user: user.toSafeObject()
      });
    }

    res.status(400).json({ success: false, message: 'Pricing rates can only be updated for flexible or on-demand drivers' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error updating rates' });
  }
});

// @route   POST /api/auth/firebase-verify
// @desc    Verify Firebase Phone Auth ID token → return Vaygo JWT
router.post('/firebase-verify', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ success: false, message: 'Firebase ID token required' });
    }

    // Verify token with Firebase Admin
    const decoded = await admin.auth().verifyIdToken(idToken);
    const firebasePhone = decoded.phone_number; // e.g. '+918767999872'

    if (!firebasePhone) {
      return res.status(400).json({ success: false, message: 'Phone number not found in token' });
    }

    // Strip +91 to match how we store phone in MongoDB
    const phone = firebasePhone.replace(/^\+91/, '').replace(/\s/g, '');

    // Passenger uses flat 'phone'; drivers use nested 'personal_info.phone'
    const user = await Passenger.findOne({ phone }) ||
                  await User.findOne({ 'personal_info.phone': phone }) ||
                  await PlannedDriver.findOne({ 'personal_info.phone': phone }) ||
                  await FlexibleDriver.findOne({ 'personal_info.phone': phone }) ||
                  await OnDemandDriver.findOne({ 'personal_info.phone': phone });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found. Please register first.' });
    }

    // Issue Vaygo JWT
    const role = user.account?.role || user.role || 'passenger';
    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '15m',
    });

    res.json({
      success: true,
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    console.error('Firebase verify error:', err.message);
    res.status(401).json({ success: false, message: 'Invalid or expired Firebase token' });
  }
});

module.exports = router;
