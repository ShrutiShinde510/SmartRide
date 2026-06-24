const M3Request = require('../models/M3Request.model');
const M3Booking = require('../models/M3Booking.model');
const VehicleInspection = require('../models/VehicleInspection.model');
const Dispute = require('../models/Dispute.model');
const OnDemandDriver = require('../models/OnDemandDriver.model');

// Family posts a request
exports.createRequest = async (req, res) => {
  try {
    const { carDetails, pickupLocation, dropoffLocation, date, durationHours, estimatedPrice } = req.body;
    
    const newRequest = new M3Request({
      familyId: req.user.id,
      carDetails,
      pickupLocation,
      dropoffLocation,
      date,
      durationHours,
      estimatedPrice
    });

    await newRequest.save();
    res.status(201).json({ success: true, request: newRequest });
  } catch (error) {
    console.error('M3 createRequest error:', error);
    res.status(500).json({ success: false, message: 'Failed to create request' });
  }
};

// Family sees their own requests
exports.getFamilyRequests = async (req, res) => {
  try {
    const requests = await M3Request.find({ familyId: req.user.id })
      .populate('driverId', 'personal_info.full_name platform_trust.hire_rating personal_info.phone')
      .populate('interestedDrivers', 'personal_info.full_name platform_trust.hire_rating personal_info.phone')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error('M3 getFamilyRequests error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch family requests' });
  }
};

// Driver sees pending requests on gig board
exports.getPendingRequests = async (req, res) => {
  try {
    const requests = await M3Request.find({
      $or: [
        { status: 'pending' },
        { status: 'driver_confirmation_pending', driverId: req.user.id }
      ]
    })
      .populate('familyId', 'personal_info.full_name personal_info.phone')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error('M3 getPendingRequests error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch pending requests' });
  }
};

// Driver gets their active (accepted/driving) requests
exports.getDriverRequests = async (req, res) => {
  try {
    const requests = await M3Request.find({
      driverId: req.user.id,
      status: { $in: ['accepted', 'driving'] }
    })
      .populate('familyId', 'personal_info.full_name personal_info.phone')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error('M3 getDriverRequests error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch driver requests' });
  }
};

// Get single request
exports.getRequest = async (req, res) => {
  try {
    const request = await M3Request.findById(req.params.id)
      .populate('familyId', 'personal_info.full_name personal_info.phone')
      .populate('driverId', 'personal_info.full_name personal_info.phone');
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    
    const booking = await M3Booking.findOne({ requestId: req.params.id });
    res.status(200).json({ success: true, request, booking });
  } catch (error) {
    console.error('M3 getRequest error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch request' });
  }
};

// Family sees nearby available drivers
exports.getAvailableDrivers = async (req, res) => {
  try {
    // Only drivers with 20+ rides or model3_unlocked = true
    const drivers = await OnDemandDriver.find({
      'platform_trust.total_rides_on_vaygo': { $gte: 20 }
    }).select('-personal_info.password');
    res.status(200).json({ success: true, drivers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch drivers' });
  }
};

// Driver applies for a pending gig
exports.applyForGig = async (req, res) => {
  try {
    const { requestId } = req.body;
    const request = await M3Request.findById(requestId);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'This gig is no longer available.' });
    }

    if (!request.interestedDrivers.includes(req.user.id)) {
      request.interestedDrivers.push(req.user.id);
      await request.save();
    }

    res.status(200).json({ success: true, message: 'Applied successfully' });
  } catch (error) {
    console.error('M3 applyForGig error:', error);
    res.status(500).json({ success: false, message: 'Failed to apply for gig' });
  }
};

// Family selects a driver (moves to driver confirmation pending)
exports.selectDriver = async (req, res) => {
  try {
    const { requestId, driverId } = req.body;
    const request = await M3Request.findById(requestId);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'This request is already assigned or confirmed.' });
    }

    request.status = 'driver_confirmation_pending';
    request.driverId = driverId;
    await request.save();

    res.status(200).json({ success: true, message: 'Driver selected, waiting for confirmation.' });
  } catch (error) {
    console.error('M3 selectDriver error:', error);
    res.status(500).json({ success: false, message: 'Failed to select driver' });
  }
};

// Driver accepts a family's selection -> confirms booking
exports.confirmBooking = async (req, res) => {
  try {
    const { requestId, driverId } = req.body;
    const request = await M3Request.findById(requestId);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

    if (request.status !== 'driver_confirmation_pending') {
      return res.status(400).json({ success: false, message: 'This request is not pending your confirmation.' });
    }

    // Verify the confirming driver is the one selected
    if (request.driverId.toString() !== driverId && req.user.id !== driverId) {
      return res.status(403).json({ success: false, message: 'Unauthorized confirmation.' });
    }

    request.status = 'accepted';
    request.driverId = driverId;
    await request.save();

    const advanceAmount = Math.round(request.estimatedPrice * 0.3);
    const finalAmount = request.estimatedPrice - advanceAmount;

    const booking = new M3Booking({
      requestId,
      familyId: request.familyId,
      driverId: driverId,
      totalPrice: request.estimatedPrice,
      advancePayment: { amount: advanceAmount, status: 'pending' },
      finalPayment: { amount: finalAmount, status: 'pending' }
    });

    await booking.save();
    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error('M3 confirmBooking error:', error);
    res.status(500).json({ success: false, message: 'Failed to confirm booking' });
  }
};

// Mock AI for Inspection
const performMockAIDamageDetection = () => {
  // 90% chance it is clean
  const isDamaged = Math.random() > 0.9;
  return {
    isDamaged,
    confidenceScore: Math.floor(Math.random() * 20) + 80,
    notes: isDamaged ? 'Minor scratch detected on left bumper' : 'Clean'
  };
};

// Driver uploads before photos
exports.inspectionBefore = async (req, res) => {
  try {
    const { bookingId, photos } = req.body;
    
    const inspection = new VehicleInspection({
      bookingId,
      type: 'pre',
      photos,
      aiResult: performMockAIDamageDetection()
    });
    await inspection.save();

    const booking = await M3Booking.findByIdAndUpdate(bookingId, { 
      status: 'driving', 
      preInspectionId: inspection._id 
    }, { new: true });

    await M3Request.findByIdAndUpdate(booking.requestId, { status: 'driving' });

    res.status(201).json({ success: true, inspection });
  } catch (error) {
    console.error('M3 inspectionBefore error:', error);
    res.status(500).json({ success: false, message: 'Failed to complete pre-inspection' });
  }
};

// Driver uploads after photos
exports.inspectionAfter = async (req, res) => {
  try {
    const { bookingId, photos } = req.body;
    
    const inspection = new VehicleInspection({
      bookingId,
      type: 'post',
      photos,
      aiResult: performMockAIDamageDetection()
    });
    await inspection.save();

    const booking = await M3Booking.findByIdAndUpdate(bookingId, { 
      status: 'completed', 
      postInspectionId: inspection._id 
    }, { new: true });

    await M3Request.findByIdAndUpdate(booking.requestId, { status: 'completed' });

    res.status(201).json({ success: true, inspection });
  } catch (error) {
    console.error('M3 inspectionAfter error:', error);
    res.status(500).json({ success: false, message: 'Failed to complete post-inspection' });
  }
};

// Start Trip (Skip Inspection)
exports.startTrip = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await M3Booking.findByIdAndUpdate(bookingId, { 
      status: 'driving'
    }, { new: true });
    await M3Request.findByIdAndUpdate(booking.requestId, { status: 'driving' });
    res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error('M3 startTrip error:', error);
    res.status(500).json({ success: false, message: 'Failed to start trip' });
  }
};

// End Trip (Skip Inspection)
exports.endTrip = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await M3Booking.findByIdAndUpdate(bookingId, { 
      status: 'completed'
    }, { new: true });
    await M3Request.findByIdAndUpdate(booking.requestId, { status: 'completed' });
    res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error('M3 endTrip error:', error);
    res.status(500).json({ success: false, message: 'Failed to end trip' });
  }
};

// Live tracking (HTTP long-poll mock for MVP)
exports.trackLocation = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await M3Booking.findById(bookingId).populate('driverId', 'personal_info');
    
    // Send random coordinates nearby for mock live tracking
    const lat = 18.5204 + (Math.random() - 0.5) * 0.01;
    const lng = 73.8567 + (Math.random() - 0.5) * 0.01;

    res.status(200).json({
      success: true,
      booking,
      location: { lat, lng }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to track location' });
  }
};

// Family pays 30% advance
exports.paymentAdvance = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await M3Booking.findByIdAndUpdate(bookingId, {
      'advancePayment.status': 'paid'
    }, { new: true });
    res.status(200).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process advance payment' });
  }
};

// Family pays 70% final
exports.paymentFinal = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await M3Booking.findByIdAndUpdate(bookingId, {
      'finalPayment.status': 'paid'
    }, { new: true });
    res.status(200).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process final payment' });
  }
};

// Raise dispute
exports.raiseDispute = async (req, res) => {
  try {
    const { bookingId, raisedBy, reason } = req.body;
    const dispute = new Dispute({
      bookingId,
      raisedBy,
      userId: req.user.id,
      reason
    });
    await dispute.save();

    await M3Booking.findByIdAndUpdate(bookingId, { status: 'disputed' });

    res.status(201).json({ success: true, dispute });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to raise dispute' });
  }
};

// Rate Driver
exports.rateDriver = async (req, res) => {
  try {
    const { bookingId, rating } = req.body;
    await M3Booking.findByIdAndUpdate(bookingId, { driverRating: rating });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to rate' });
  }
};

// Rate Family
exports.rateFamily = async (req, res) => {
  try {
    const { bookingId, rating } = req.body;
    await M3Booking.findByIdAndUpdate(bookingId, { familyRating: rating });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to rate' });
  }
};
